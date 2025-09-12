import React, { createContext, useContext, type ReactNode } from 'react';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorContextType {
  editor: Editor | null;
  applyFormatting: (formatType: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const editor = useEditor({
    extensions: [
      // FIXED: Configure the link extension within StarterKit
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Superscript,
      Subscript,
      // REMOVED: The separate Link extension is no longer needed
      Placeholder.configure({
        placeholder: `Addition of the following features to the mobile banking platform
a. Loan Application. (Loanee)
b. Request Loan Guarantorship. With the ability to add or remove guarantors. (Loanee)
c. Ability to Accept, Reject or Amend the Guaranteed amount. (Guarantor)
d. View Loan Guarantors. (Loanee)
e. View Loans Guaranteed. (Guarantor)
f. View Loan Status i.e. No. of Guarantors, Approved, Rejected. (Loanee)`,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
      },
    },
  });

  const applyFormatting = (formatType: string) => {
    if (!editor) return;

    switch (formatType) {
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
      case 'heading4':
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numberedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'superscript':
        editor.chain().focus().toggleSuperscript().run();
        break;
      case 'subscript':
        editor.chain().focus().toggleSubscript().run();
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
      default:
        break;
    }
  };

  const contextValue: EditorContextType = {
    editor,
    applyFormatting,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};