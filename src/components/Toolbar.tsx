"use client"
import { type Editor } from "@tiptap/react"
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
} from "lucide-react"
import {Toggle} from "@/components/ui/toggle"
type Props = { editor: Editor | null}

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
      <Toggle size={"sm"} variant="outline" 
      onClick={() => editor.chain().focus().toggleBold().run()} > 
        <Bold className="h-4 w-4" />
      </Toggle>
        <Toggle size={"sm"} variant="outline" 
      onClick={() => editor.chain().focus().toggleItalic().run()} > 
        <Italic className="h-4 w-4" />
      </Toggle>
       <Toggle size={"sm"} variant="outline"  type="button" 
      onClick={() => editor.chain().focus().toggleBulletList().run()} > 
        <List className="h-4 w-4" />
      </Toggle>
         <Toggle size={"sm"} variant="outline"  type="button"
      onClick={() => editor.chain().focus().toggleOrderedList().run()} > 
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      </div> 
  )
}