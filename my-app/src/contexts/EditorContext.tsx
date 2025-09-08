import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface EditorContextType {
  editorRef: React.RefObject<HTMLDivElement>;
  applyFormatting: (formatType: string) => void;
  editorValue: string;
  setEditorValue: (value: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorValue, setEditorValue] = useState('');

  const applyFormatting = (formatType: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    switch (formatType) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'heading1':
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'heading2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
      case 'heading3':
        document.execCommand('formatBlock', false, '<h3>');
        break;
      case 'heading4':
        document.execCommand('formatBlock', false, '<h4>');
        break;
      case 'bulletList':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'numberedList':
        document.execCommand('insertOrderedList', false);
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      case 'quote':
        document.execCommand('formatBlock', false, '<blockquote>');
        break;
      case 'code':
        document.execCommand('formatBlock', false, '<code>');
        break;
      case 'superscript':
        document.execCommand('superscript', false);
        break;
      case 'subscript':
        document.execCommand('subscript', false);
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft', false);
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'alignRight':
        document.execCommand('justifyRight', false);
        break;
      default:
        break;
    }

    const newValue = editor.innerHTML;
    setEditorValue(newValue);
  };

  // Create the context value with a non-null assertion since we know it's safe
  const contextValue: EditorContextType = {
    editorRef: editorRef as React.RefObject<HTMLDivElement>,
    applyFormatting,
    editorValue,
    setEditorValue
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};