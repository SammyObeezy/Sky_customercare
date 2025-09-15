import React from 'react';
import { DownloadIcon } from '../Icons'; // Assuming you have a DownloadIcon in Icons.tsx
import './FilePreviewer.css';

// Define the shape of the file prop
interface FilePreviewerProps {
  file: {
    name: string;
    type: string;
    dataUrl: string;
  };
  onClose: () => void;
}

const FilePreviewer: React.FC<FilePreviewerProps> = ({ file, onClose }) => {
  // Check the file type to determine how to render it
  const isPdf = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');

  return (
    // The overlay closes the modal when clicked
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <span className="preview-title">{file.name}</span>
          <button className="preview-close" onClick={onClose} title="Close">&times;</button>
        </div>
        <div className="preview-content">
          {isPdf && (
            <iframe src={file.dataUrl} title={file.name} width="100%" height="100%" />
          )}
          {isImage && (
            <img src={file.dataUrl} alt={`Preview of ${file.name}`} />
          )}
          {!isPdf && !isImage && (
            <div className="unsupported-preview">
              <p>No preview available for this file type.</p>
              <a href={file.dataUrl} download={file.name} className="download-link">
                <DownloadIcon /> Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewer;