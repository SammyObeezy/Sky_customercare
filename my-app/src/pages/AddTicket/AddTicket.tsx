import React, { useState } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  StrikeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  BulletListIcon,
  NumberedListIcon,
  LinkIcon,
  ImageIcon,
  VideoIcon,
  QuoteIcon,
  CodeIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  SuperscriptIcon,
  SubscriptIcon
} from '../../components/Icons';
import './AddTicket.css';

interface AttachmentFile {
  id: string;
  name: string;
  file: File;
}

const AddTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    mainCategory: '',
    subCategory: '',
    problemIssue: '',
    description: ''
  });
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, attachments);
  };

  const handleCreateAndAdd = () => {
    console.log('Create and add another');
    setFormData({
      mainCategory: '',
      subCategory: '',
      problemIssue: '',
      description: ''
    });
    setAttachments([]);
  };

  return (
    <div className="create-ticket-page">
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>Create Ticket</h1>
        </div>
        <hr className="page-divider" />
      </div>

      <div className="create-ticket-container">
        <form className="create-ticket-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="mainCategory">Main Category</label>
              <input
                type="text"
                id="mainCategory"
                name="mainCategory"
                value={formData.mainCategory}
                onChange={handleInputChange}
                placeholder="Sky Portal"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subCategory">Sub Category</label>
              <input
                type="text"
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                placeholder="User Administration"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="problemIssue">Problem/Issue</label>
              <input
                type="text"
                id="problemIssue"
                name="problemIssue"
                value={formData.problemIssue}
                onChange={handleInputChange}
                placeholder="Deactivate User"
                required
              />
            </div>

            <div className="form-group description-group">
              <label htmlFor="description">Description</label>
              <div className="editor-toolbar">
                {/* Group 1: Text Formatting (5 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Bold">
                    <BoldIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Italic">
                    <ItalicIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Underline">
                    <UnderlineIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Strikethrough">
                    <StrikethroughIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Strikethrough">
                    <StrikeIcon />
                  </button>
                </div>

                {/* Group 2: Headings (4 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Heading 1">
                    <Heading1Icon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Heading 2">
                    <Heading2Icon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Heading 3">
                    <Heading3Icon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Heading 4">
                    <Heading4Icon width={16} height={16} />
                  </button>
                </div>

                {/* Group 3: Lists (2 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Bullet List">
                    <BulletListIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Numbered List">
                    <NumberedListIcon width={16} height={16} />
                  </button>
                </div>

                {/* Group 4: Media (5 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Link">
                    <LinkIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Image">
                    <ImageIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Video">
                    <VideoIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Quote">
                    <QuoteIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Code">
                    <CodeIcon width={16} height={16} />
                  </button>
                </div>

                {/* Group 5: Alignment (3 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Align Left">
                    <AlignLeftIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Align Center">
                    <AlignCenterIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Align Right">
                    <AlignRightIcon width={16} height={16} />
                  </button>
                </div>

                {/* Group 6: Script (2 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Superscript">
                    <SuperscriptIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Subscript">
                    <SubscriptIcon width={16} height={16} />
                  </button>
                </div>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Addition of the following features to the mobile banking platform
a. Loan Application. (Loanee)
b. Request Loan Guarantorship. With the ability to add or remove guarantors. (Loanee)
c. Ability to Accept, Reject or Amend the Guaranteed amount. (Guarantor)
d. View Loan Guarantors. (Loanee)
e. View Loans Guaranteed. (Guarantor)
f. View Loan Status i.e. No. of Guarantors, Approved, Rejected. (Loanee)"
                rows={12}
                required
              />
            </div>

            <div className="form-group">
              <label>Attachments</label>
              <div className="file-upload-section">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                  accept=".jpg,.jpeg,.pdf,.png"
                />
                <label htmlFor="fileUpload" className="file-upload-btn">
                  Select File(s)
                </label>
                <div className="file-info">
                  <p>Allowed file extensions: .jpg, .jpeg, .pdf, .png</p>
                  <p>Maximum file Size: 2MB</p>
                  <p>Maximum No. of files: 5</p>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="attachments-list">
                  {attachments.map(attachment => (
                    <div key={attachment.id} className="attachment-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" />
                        <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="attachment-name">{attachment.name}</span>
                      <button
                        type="button"
                        className="remove-attachment"
                        onClick={() => removeAttachment(attachment.id)}
                        title="Remove file"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="create-btn">
              Create
            </button>
            <button type="button" className="create-add-btn" onClick={handleCreateAndAdd}>
              Create and add another
            </button>
            <button type="button" className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;