import React, { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTickets, type Ticket, type Attachment } from '../../../contexts/TicketsContext';
import FilePreviewer from '../../../components/FilePreviewer/FilePreviewer';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  BulletListIcon,
  NumberedListIcon,
  LinkIcon,
  QuoteIcon,
  CodeIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon
} from '../../../components/Icons';
import './styles.css';

export const Route = createFileRoute('/_authenticated/ticket/$ticketId')({
  component: TicketDetailsPage,
});

function TicketDetailsPage() {
  const { tickets, updateTicket, addAttachmentToTicket, removeAttachmentFromTicket } = useTickets();
  const { ticketId: encodedId } = Route.useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [previewFile, setPreviewFile] = useState<Attachment | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const ticket = React.useMemo(() => {
    try {
      const decodedId = atob(encodedId);
      return tickets.find(t => t.id.toString() === decodedId);
    } catch (error) {
      console.error("Failed to decode or find ticket:", error);
      return null;
    }
  }, [encodedId, tickets]);

  const [editedData, setEditedData] = useState<Partial<Ticket>>({});

  const editor = useEditor({
    extensions: [StarterKit],
    content: ticket?.description || '',
    editable: isEditing,
  });

  useEffect(() => {
    if (isEditing && ticket) {
      setEditedData({
        ticketSubject: ticket.ticketSubject,
        ticketStatus: ticket.ticketStatus,
        mainCategory: ticket.mainCategory,
        subCategory: ticket.subCategory,
        problemIssue: ticket.problemIssue,
        description: ticket.description
      });
      editor?.commands.setContent(ticket.description);
    }
  }, [isEditing, ticket, editor]);

  // Sync editor content with form state
  useEffect(() => {
    if (editor && isEditing) {
      const updateDescription = () => {
        const htmlContent = editor.getHTML();
        setEditedData(prev => ({
          ...prev,
          description: htmlContent
        }));
      };

      editor.on('update', updateDescription);
      return () => {
        editor.off('update', updateDescription);
      };
    }
  }, [editor, isEditing]);
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const applyFormatting = (format: string) => {
    if (!editor) return;

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strikethrough':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numberedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'alignLeft':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'alignCenter':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'alignRight':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'link':
        const url = window.prompt('Enter URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setPendingFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    if (ticket) {
      removeAttachmentFromTicket(ticket.id, attachmentId);
    }
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!ticket) return;
    
    // First, add any pending files as attachments
    if (pendingFiles.length > 0) {
      await addAttachmentToTicket(ticket.id, pendingFiles);
      setPendingFiles([]);
    }
    
    // Then update other ticket fields
    const finalUpdates = {
      ...editedData,
      description: editor?.getHTML() || ticket.description,
    };
    updateTicket(ticket.id, finalUpdates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
    setPendingFiles([]); // Clear pending files on cancel
    if (editor && ticket) {
      editor.commands.setContent(ticket.description);
    }
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  if (!ticket) {
    return (
      <div className="ticket-details-not-found">
        <h2>Ticket Not Found</h2>
        <p>Sorry, we could not find a ticket with that ID.</p>
        <Link to="/ticket-list" search={{ page: 1, filters: [], sorters: [] }} className="ticket-details-back-link">
          &larr; Back to Ticket List
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="ticket-details-main-page">
        <div className="ticket-details-page-header-section">
          <div className="ticket-details-page-header-content">
            <h1>Ticket #{ticket.id}</h1>
            <p className="ticket-details-subject-header">Subject: {editedData.ticketSubject || ticket.ticketSubject}</p>
          </div>
          <hr className="ticket-details-page-divider" />
        </div>

        <Link to="/ticket-list" search={{ page: 1, filters: [], sorters: [] }} className="ticket-details-back-link">
          &larr; Back to Ticket List
        </Link>

        <div className="ticket-details-content-grid">
          {/* Left Column - Forms */}
          <div className="ticket-details-form-section">
            {isEditing ? (
              <div className="ticket-details-edit-form-container">
                <div className="ticket-details-form-section-inner">
                  <div className="ticket-details-form-group">
                    <label htmlFor="ticketSubject">Ticket Subject</label>
                    <input
                      type="text"
                      id="ticketSubject"
                      name="ticketSubject"
                      value={editedData.ticketSubject || ''}
                      onChange={handleEditChange}
                      placeholder="Enter ticket subject"
                    />
                  </div>

                  <div className="ticket-details-form-group">
                    <label htmlFor="ticketStatus">Status</label>
                    <select
                      id="ticketStatus"
                      name="ticketStatus"
                      value={editedData.ticketStatus || ''}
                      onChange={handleEditChange}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </div>

                  <div className="ticket-details-form-group">
                    <label htmlFor="mainCategory">Main Category</label>
                    <input
                      type="text"
                      id="mainCategory"
                      name="mainCategory"
                      value={editedData.mainCategory || ''}
                      onChange={handleEditChange}
                      placeholder="Sky Portal"
                    />
                  </div>

                  <div className="ticket-details-form-group">
                    <label htmlFor="subCategory">Sub Category</label>
                    <input
                      type="text"
                      id="subCategory"
                      name="subCategory"
                      value={editedData.subCategory || ''}
                      onChange={handleEditChange}
                      placeholder="User Administration"
                    />
                  </div>

                  <div className="ticket-details-form-group">
                    <label htmlFor="problemIssue">Problem/Issue</label>
                    <input
                      type="text"
                      id="problemIssue"
                      name="problemIssue"
                      value={editedData.problemIssue || ''}
                      onChange={handleEditChange}
                      placeholder="Deactivate User"
                    />
                  </div>

                  <div className="ticket-details-form-group ticket-details-description-group">
                    <label>Description</label>
                    <div className="ticket-details-editor-toolbar">
                      <div className="ticket-details-toolbar-group">
                        <button type="button" className="ticket-details-toolbar-btn" title="Bold" onClick={() => applyFormatting('bold')}>
                          <BoldIcon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Italic" onClick={() => applyFormatting('italic')}>
                          <ItalicIcon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Underline" onClick={() => applyFormatting('underline')}>
                          <UnderlineIcon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Strikethrough" onClick={() => applyFormatting('strikethrough')}>
                          <StrikethroughIcon width={16} height={16} />
                        </button>
                      </div>

                      <div className="ticket-details-toolbar-group">
                        <button type="button" className="ticket-details-toolbar-btn" title="Heading 1" onClick={() => applyFormatting('heading1')}>
                          <Heading1Icon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Heading 2" onClick={() => applyFormatting('heading2')}>
                          <Heading2Icon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Heading 3" onClick={() => applyFormatting('heading3')}>
                          <Heading3Icon width={16} height={16} />
                        </button>
                      </div>

                      <div className="ticket-details-toolbar-group">
                        <button type="button" className="ticket-details-toolbar-btn" title="Bullet List" onClick={() => applyFormatting('bulletList')}>
                          <BulletListIcon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Numbered List" onClick={() => applyFormatting('numberedList')}>
                          <NumberedListIcon width={16} height={16} />
                        </button>
                      </div>

                      <div className="ticket-details-toolbar-group">
                        <button type="button" className="ticket-details-toolbar-btn" title="Link" onClick={() => applyFormatting('link')}>
                          <LinkIcon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Quote" onClick={() => applyFormatting('quote')}>
                          <QuoteIcon width={16} height={16} />
                        </button>
                        <button type="button" className="ticket-details-toolbar-btn" title="Code" onClick={() => applyFormatting('code')}>
                          <CodeIcon width={16} height={16} />
                        </button>
                      </div>
                    </div>

                    <EditorContent
                      editor={editor}
                      className="ticket-details-tiptap-editor-content"
                    />
                  </div>
                </div>

                <div className="ticket-details-form-actions">
                  <button onClick={handleSave} className="ticket-details-save-btn">Save Changes</button>
                  <button onClick={handleCancel} className="ticket-details-cancel-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="ticket-details-form-display">
                <div className="ticket-details-display-header">
                  <h3>Ticket Information</h3>
                  <button onClick={() => setIsEditing(true)} className="ticket-details-edit-btn">Edit Ticket</button>
                </div>
                
                <div className="ticket-details-info-grid">
                  <div className="ticket-details-info-item">
                    <label>Subject</label>
                    <span>{ticket.ticketSubject}</span>
                  </div>
                  <div className="ticket-details-info-item">
                    <label>Status</label>
                    <span className={`ticket-details-status-badge ticket-details-status-${ticket.ticketStatus.toLowerCase().replace(' ', '-')}`}>
                      {ticket.ticketStatus}
                    </span>
                  </div>
                  <div className="ticket-details-info-item">
                    <label>Main Category</label>
                    <span>{ticket.mainCategory}</span>
                  </div>
                  <div className="ticket-details-info-item">
                    <label>Sub Category</label>
                    <span>{ticket.subCategory}</span>
                  </div>
                  <div className="ticket-details-info-item">
                    <label>Problem/Issue</label>
                    <span>{ticket.problemIssue}</span>
                  </div>
                  <div className="ticket-details-info-item">
                    <label>Source</label>
                    <span>{ticket.source}</span>
                  </div>
                  <div className="ticket-details-info-item">
                    <label>Date Requested</label>
                    <span>{new Date(ticket.dateRequested).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - File Attachments & Preview */}
          <div className="ticket-details-preview-section">
            <div className="ticket-details-preview-container">
              <h3>Attachments & Files</h3>
              
              {ticket.attachments && ticket.attachments.length > 0 ? (
                <div className="ticket-details-attachments-section">
                  <div className="ticket-details-attachments-header">
                    <span className="ticket-details-attachment-count">{ticket.attachments.length} file(s) attached</span>
                  </div>
                  
                  <div className="ticket-details-attachments-list">
                    {ticket.attachments.map(file => (
                      <div key={file.id} className="ticket-details-attachment-item">
                        <div className="ticket-details-attachment-icon">
                          <svg width="20" height="20" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.99931 15.4883C2.24908 15.4883 1.52877 15.2076 0.95469 14.6881C-0.318181 13.5336 -0.318181 11.6558 0.954396 10.5021L10.8796 0.973574C12.4282 -0.428676 14.8003 -0.302676 16.5314 1.26432C17.307 1.96682 17.7423 2.97957 17.726 4.04407C17.7096 5.09734 17.2545 6.10532 16.4766 6.80982L8.97543 14.0293C8.76665 14.2316 8.41656 14.2408 8.19369 14.0511C7.97136 13.8611 7.96058 13.5441 8.17019 13.3426L15.6827 6.11207C16.2703 5.57982 16.6074 4.82481 16.6198 4.03006C16.6323 3.23482 16.3146 2.48506 15.7493 1.97281C14.6874 1.01081 12.9586 0.507058 11.6732 1.67181L1.74828 11.2003C0.894907 11.9738 0.895184 13.2161 1.73722 13.9793C2.13209 14.3365 2.60081 14.5105 3.09995 14.4833C3.59383 14.456 4.10154 14.227 4.52961 13.839L12.4268 6.24003C12.713 5.98078 13.2881 5.34528 12.7027 4.81478C12.3712 4.51453 12.1383 4.53303 12.0618 4.53878C11.843 4.55628 11.5875 4.69303 11.3223 4.93353L5.37828 10.6488C5.16839 10.8505 4.81803 10.8603 4.59651 10.67C4.3739 10.4805 4.36367 10.163 4.57301 9.96203L10.5279 4.23603C10.996 3.81078 11.4747 3.58028 11.9619 3.54078C12.3422 3.51026 12.9077 3.58353 13.4845 4.10653C14.3407 4.88201 14.2342 6.01953 13.2204 6.93803L5.32327 14.5365C4.69278 15.1085 3.93147 15.4408 3.1677 15.4832C3.11156 15.4867 3.05542 15.4882 2.99929 15.4882L2.99931 15.4883Z" fill="#1C7ED6" />
                          </svg>
                        </div>
                        <div className="ticket-details-attachment-details">
                          <div className="ticket-details-attachment-name">{file.name}</div>
                          <div className="ticket-details-attachment-meta">
                            <span className="ticket-details-attachment-type">{file.type}</span>
                            <span className="ticket-details-attachment-size">{formatBytes(file.size)}</span>
                          </div>
                        </div>
                        <div className="ticket-details-attachment-actions">
                          <button className="ticket-details-preview-btn" onClick={() => setPreviewFile(file)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Preview
                          </button>
                          {isEditing && (
                            <button className="ticket-details-remove-btn" onClick={() => handleRemoveAttachment(file.id)} title="Remove attachment">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ticket-details-no-attachments">
                  <div className="ticket-details-no-attachments-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#e9ecef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="#e9ecef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>No attachments found</p>
                  <span>Files uploaded to this ticket will appear here</span>
                </div>
              )}

              {isEditing && (
                <div className="ticket-details-file-upload-section">
                  <h4>Add New Attachments</h4>
                  <div className="ticket-details-upload-area">
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      onChange={handleFileUpload}
                      className="ticket-details-file-input"
                      accept=".jpg,.jpeg,.pdf,.png,.doc,.docx"
                    />
                    <label htmlFor="fileUpload" className="ticket-details-file-upload-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Choose Files
                    </label>
                    <div className="ticket-details-upload-info">
                      <p>Drag and drop files here or click to browse</p>
                      <p className="ticket-details-file-restrictions">
                        Supported: .jpg, .jpeg, .pdf, .png, .doc, .docx<br/>
                        Max size: 10MB per file
                      </p>
                    </div>
                  </div>

                  {/* Show pending files */}
                  {pendingFiles.length > 0 && (
                    <div className="ticket-details-pending-files">
                      <h5>Files to be added:</h5>
                      <div className="ticket-details-pending-files-list">
                        {pendingFiles.map((file, index) => (
                          <div key={index} className="ticket-details-pending-file-item">
                            <div className="ticket-details-attachment-icon">
                              <svg width="16" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.99931 15.4883C2.24908 15.4883 1.52877 15.2076 0.95469 14.6881C-0.318181 13.5336 -0.318181 11.6558 0.954396 10.5021L10.8796 0.973574C12.4282 -0.428676 14.8003 -0.302676 16.5314 1.26432C17.307 1.96682 17.7423 2.97957 17.726 4.04407C17.7096 5.09734 17.2545 6.10532 16.4766 6.80982L8.97543 14.0293C8.76665 14.2316 8.41656 14.2408 8.19369 14.0511C7.97136 13.8611 7.96058 13.5441 8.17019 13.3426L15.6827 6.11207C16.2703 5.57982 16.6074 4.82481 16.6198 4.03006C16.6323 3.23482 16.3146 2.48506 15.7493 1.97281C14.6874 1.01081 12.9586 0.507058 11.6732 1.67181L1.74828 11.2003C0.894907 11.9738 0.895184 13.2161 1.73722 13.9793C2.13209 14.3365 2.60081 14.5105 3.09995 14.4833C2.59383 14.456 4.10154 14.227 4.52961 13.839L12.4268 6.24003C12.713 5.98078 13.2881 5.34528 12.7027 4.81478C12.3712 4.51453 12.1383 4.53303 12.0618 4.53878C11.843 4.55628 11.5875 4.69303 11.3223 4.93353L5.37828 10.6488C5.16839 10.8505 4.81803 10.8603 4.59651 10.67C4.3739 10.4805 4.36367 10.163 4.57301 9.96203L10.5279 4.23603C10.996 3.81078 11.4747 3.58028 11.9619 3.54078C12.3422 3.51026 12.9077 3.58353 13.4845 4.10653C14.3407 4.88201 14.2342 6.01953 13.2204 6.93803L5.32327 14.5365C4.69278 15.1085 3.93147 15.4408 3.1677 15.4832C3.11156 15.4867 3.05542 15.4882 2.99929 15.4882L2.99931 15.4883Z" fill="#27ae60" />
                              </svg>
                            </div>
                            <div className="ticket-details-pending-file-details">
                              <span className="ticket-details-pending-file-name">{file.name}</span>
                              <span className="ticket-details-pending-file-size">{formatBytes(file.size)}</span>
                            </div>
                            <button 
                              className="ticket-details-remove-pending-btn"
                              onClick={() => handleRemovePendingFile(index)}
                              title="Remove file"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="ticket-details-description-section">
                <h4>Description</h4>
                <div className="ticket-details-description-display">
                  <div dangerouslySetInnerHTML={{ __html: isEditing ? (editedData.description || ticket.description) : ticket.description }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {previewFile && <FilePreviewer file={previewFile} onClose={() => setPreviewFile(null)} />}
    </>
  );
}

export default TicketDetailsPage;