import React, { useState, useEffect } from 'react';
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
import { useEditorContext } from '../../contexts/EditorContext';
import { EditorContent } from '@tiptap/react';
import './AddTicket.css';

interface AttachmentFile {
  id: string;
  name: string;
  file: File;
}

const AddTicket: React.FC = () => {
  const { editor, applyFormatting } = useEditorContext();
  
  const [formData, setFormData] = useState({
    mainCategory: '',
    subCategory: '',
    problemIssue: '',
    description: ''
  });
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  // Sync editor content with form state
  useEffect(() => {
    if (editor) {
      const updateDescription = () => {
        const htmlContent = editor.getHTML();
        setFormData(prev => ({
          ...prev,
          description: htmlContent
        }));
      };

      editor.on('update', updateDescription);
      return () => {
        editor.off('update', updateDescription);
      };
    }
  }, [editor]);

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
    if (editor) {
      editor.commands.clearContent();
    }
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
                  <button type="button" className="toolbar-btn first" title="Bold" onClick={() => applyFormatting('bold')}>
                    <BoldIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Italic" onClick={() => applyFormatting('italic')}>
                    <ItalicIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Underline" onClick={() => applyFormatting('underline')}>
                    <UnderlineIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Strikethrough" onClick={() => applyFormatting('strikethrough')}>
                    <StrikethroughIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Strikethrough" onClick={() => applyFormatting('strikethrough')}>
                    <StrikeIcon />
                  </button>
                </div>

                {/* Group 2: Headings (4 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Heading 1" onClick={() => applyFormatting('heading1')}>
                    <Heading1Icon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Heading 2" onClick={() => applyFormatting('heading2')}>
                    <Heading2Icon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Heading 3" onClick={() => applyFormatting('heading3')}>
                    <Heading3Icon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Heading 4" onClick={() => applyFormatting('heading4')}>
                    <Heading4Icon width={16} height={16} />
                  </button>
                </div>

                {/* Group 3: Lists (2 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Bullet List" onClick={() => applyFormatting('bulletList')}>
                    <BulletListIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Numbered List" onClick={() => applyFormatting('numberedList')}>
                    <NumberedListIcon width={16} height={16} />
                  </button>
                </div>

                {/* Group 4: Media (5 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Link" onClick={() => applyFormatting('link')}>
                    <LinkIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Image" onClick={() => console.log('Image functionality - requires file upload')}>
                    <ImageIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Video" onClick={() => console.log('Video functionality - requires URL input')}>
                    <VideoIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Quote" onClick={() => applyFormatting('quote')}>
                    <QuoteIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Code" onClick={() => applyFormatting('code')}>
                    <CodeIcon width={16} height={16} />
                  </button>
                </div>

                {/* Group 5: Alignment (3 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Align Left" onClick={() => applyFormatting('alignLeft')}>
                    <AlignLeftIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn" title="Align Center" onClick={() => applyFormatting('alignCenter')}>
                    <AlignCenterIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Align Right" onClick={() => applyFormatting('alignRight')}>
                    <AlignRightIcon width={16} height={16} />
                  </button>
                </div>

                {/* Group 6: Script (2 buttons) */}
                <div className="toolbar-group">
                  <button type="button" className="toolbar-btn first" title="Superscript" onClick={() => applyFormatting('superscript')}>
                    <SuperscriptIcon width={16} height={16} />
                  </button>
                  <button type="button" className="toolbar-btn last" title="Subscript" onClick={() => applyFormatting('subscript')}>
                    <SubscriptIcon width={16} height={16} />
                  </button>
                </div>
              </div>
              
              <EditorContent 
                editor={editor} 
                className="tiptap-editor-content"
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
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.99931 15.4883C2.24908 15.4883 1.52877 15.2076 0.95469 14.6881C-0.318181 13.5336 -0.318181 11.6558 0.954396 10.5021L10.8796 0.973574C12.4282 -0.428676 14.8003 -0.302676 16.5314 1.26432C17.307 1.96682 17.7423 2.97957 17.726 4.04407C17.7096 5.09734 17.2545 6.10532 16.4766 6.80982L8.97543 14.0293C8.76665 14.2316 8.41656 14.2408 8.19369 14.0511C7.97136 13.8611 7.96058 13.5441 8.17019 13.3426L15.6827 6.11207C16.2703 5.57982 16.6074 4.82481 16.6198 4.03006C16.6323 3.23482 16.3146 2.48506 15.7493 1.97281C14.6874 1.01081 12.9586 0.507058 11.6732 1.67181L1.74828 11.2003C0.894907 11.9738 0.895184 13.2161 1.73722 13.9793C2.13209 14.3365 2.60081 14.5105 3.09995 14.4833C3.59383 14.456 4.10154 14.227 4.52961 13.839L12.4268 6.24003C12.713 5.98078 13.2881 5.34528 12.7027 4.81478C12.3712 4.51453 12.1383 4.53303 12.0618 4.53878C11.843 4.55628 11.5875 4.69303 11.3223 4.93353L5.37828 10.6488C5.16839 10.8505 4.81803 10.8603 4.59651 10.67C4.3739 10.4805 4.36367 10.163 4.57301 9.96203L10.5279 4.23603C10.996 3.81078 11.4747 3.58028 11.9619 3.54078C12.3422 3.51026 12.9077 3.58353 13.4845 4.10653C14.3407 4.88201 14.2342 6.01953 13.2204 6.93803L5.32327 14.5365C4.69278 15.1085 3.93147 15.4408 3.1677 15.4832C3.11156 15.4867 3.05542 15.4882 2.99929 15.4882L2.99931 15.4883Z" fill="#1C7ED6"/>
</svg>

                      <span className="attachment-name">{attachment.name}</span>
                      <button
                        type="button"
                        className="remove-attachment"
                        onClick={() => removeAttachment(attachment.id)}
                        title="Remove file"
                      >
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.950139 0.46967C1.24303 0.176777 1.71791 0.176777 2.0108 0.46967L5.48047 3.93934L8.95014 0.46967C9.24303 0.176777 9.71791 0.176777 10.0108 0.46967C10.3037 0.762563 10.3037 1.23744 10.0108 1.53033L6.54113 5L10.0108 8.46967C10.3037 8.76256 10.3037 9.23744 10.0108 9.53033C9.71791 9.82322 9.24303 9.82322 8.95014 9.53033L5.48047 6.06066L2.0108 9.53033C1.71791 9.82322 1.24303 9.82322 0.950139 9.53033C0.657245 9.23744 0.657245 8.76256 0.950139 8.46967L4.41981 5L0.950139 1.53033C0.657245 1.23744 0.657245 0.762563 0.950139 0.46967Z" fill="#C92A2A"/>
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