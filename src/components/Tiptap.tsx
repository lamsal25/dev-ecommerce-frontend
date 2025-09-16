"use client";
import { Toolbar } from "./Toolbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = ({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: "p-4 border rounded min-h-[200px] focus:outline-none list-decimal list-inside space-y-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return (
    <div>
      <EditorContent editor={editor} />
      <Toolbar editor={editor} />
    </div>
  );
};

export default Tiptap;
