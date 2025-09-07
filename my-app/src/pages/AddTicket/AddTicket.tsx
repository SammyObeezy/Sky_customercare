import React, { useState } from 'react';
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
    // Add form submission logic here
  };

  const handleCreateAndAdd = () => {
    console.log('Create and add another');
    // Reset form after creation
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
      {/* Full-width header section */}
      <div className="page-header-section">
        <div className="page-header-content">
          <h1>Create Ticket</h1>
        </div>
        <hr className="page-divider" />
      </div>

      {/* Form container */}
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
                <button type="button" className="toolbar-btn" title="Bold">
                  <strong>B</strong>
                </button>
                <button type="button" className="toolbar-btn" title="Italic">
                  <em>I</em>
                </button>
                <button type="button" className="toolbar-btn" title="Underline">
                  <u>U</u>
                </button>
                <button type="button" className="toolbar-btn" title="Strikethrough">
                  <s>S</s>
                </button>
                <div className="toolbar-separator"></div>
                <button type="button" className="toolbar-btn" title="Heading 1">H1</button>
                <button type="button" className="toolbar-btn" title="Heading 2">H2</button>
                <button type="button" className="toolbar-btn" title="Heading 3">H3</button>
                <div className="toolbar-separator"></div>
                <button type="button" className="toolbar-btn" title="Bullet List">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="6" cy="12" r="2" fill="currentColor"/>
                    <path d="M10 12h10M10 6h10M10 18h10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
                <button type="button" className="toolbar-btn" title="Numbered List">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M10 6h11M10 12h11M10 18h11M4 6v4M4 10l2-2M6 18H2l4-4v2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Addition of the following features to the mobile banking platform..."
                rows={8}
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
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="13,2 13,9 20,9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="attachment-name">{attachment.name}</span>
                      <button
                        type="button"
                        className="remove-attachment"
                        onClick={() => removeAttachment(attachment.id)}
                        title="Remove file"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
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