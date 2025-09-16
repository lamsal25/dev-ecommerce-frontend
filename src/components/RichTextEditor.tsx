"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export type RichTextEditorHandle = {
  getContent: () => string;
};

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ initialContent = '', onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const isInitializingRef = useRef(false);
    const lastContentRef = useRef(initialContent);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const uniqueId = useRef(`quill-editor-${Math.random().toString(36).substring(2, 9)}`);

    // Debounced onChange to prevent rapid firing
    const debouncedOnChange = useCallback((content: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (onChange && content !== lastContentRef.current) {
          lastContentRef.current = content;
          onChange(content);
        }
      }, 100); // 100ms debounce
    }, [onChange]);

    useEffect(() => {
      // Cleanup any existing toolbars first
      const cleanupExistingToolbars = () => {
        if (editorRef.current) {
          const parent = editorRef.current.parentElement;
          if (parent) {
            // Remove any existing toolbars
            const existingToolbars = parent.querySelectorAll('.ql-toolbar');
            existingToolbars.forEach(toolbar => {
              if (toolbar.parentNode) {
                toolbar.parentNode.removeChild(toolbar);
              }
            });
          }
          
          // Clear the editor content to start fresh
          editorRef.current.innerHTML = '';
          editorRef.current.className = '';
        }
      };

      // Only initialize if we don't have a Quill instance and the ref exists
      if (editorRef.current && !quillRef.current && !isInitializingRef.current) {
        isInitializingRef.current = true;
        
        try {
          // Clean up any existing instances first
          cleanupExistingToolbars();
          
          // Add unique ID for tracking
          editorRef.current.id = uniqueId.current;
          
          // Initialize Quill with optimized configuration
          quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                ['clean'],
              ],
            },
            placeholder: 'Write your product description...',
            bounds: editorRef.current.parentElement || editorRef.current,
          });

          // Set initial content without triggering onChange
          if (initialContent && initialContent !== '') {
            const delta = quillRef.current.clipboard.convert({ html: initialContent });
            quillRef.current.setContents(delta, 'silent');
            lastContentRef.current = initialContent;
          }

          // Set up optimized change handler
          quillRef.current.on('text-change', (delta, oldDelta, source) => {
            // Only trigger onChange for user changes, not programmatic ones
            if (source === 'user' && quillRef.current) {
              const content = quillRef.current.root.innerHTML;
              debouncedOnChange(content);
            }
          });

          console.log('Quill editor initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Quill editor:', error);
        } finally {
          isInitializingRef.current = false;
        }
      }

      // Cleanup function
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []); // Empty dependency array - only run once

    // Handle initial content changes after initialization
    useEffect(() => {
      if (
        quillRef.current && 
        initialContent !== lastContentRef.current && 
        !isInitializingRef.current
      ) {
        try {
          const delta = quillRef.current.clipboard.convert({ html: initialContent });
          quillRef.current.setContents(delta, 'silent');
          lastContentRef.current = initialContent;
        } catch (error) {
          console.error('Failed to update Quill content:', error);
        }
      }
    }, [initialContent]);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML;
        }
        return lastContentRef.current || '';
      },
    }), []);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (quillRef.current) {
          try {
            // Clean up Quill instance
            quillRef.current.off('text-change');
            
            // Remove toolbar if it exists
            const toolbar = document.querySelector(`#${uniqueId.current}`);
            if (toolbar && toolbar.parentElement) {
              const existingToolbar = toolbar.parentElement.querySelector('.ql-toolbar');
              if (existingToolbar && existingToolbar.parentNode) {
                existingToolbar.parentNode.removeChild(existingToolbar);
              }
            }
            
            quillRef.current = null;
          } catch (error) {
            console.error('Error during Quill cleanup:', error);
          }
        }
      };
    }, []);

    return (
      <div className="quill-wrapper" style={{ position: 'relative' }}>
        <div 
          ref={editorRef} 
          style={{ 
            height: '200px', 
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px'
          }} 
        />
        <style jsx global>{`
          .ql-toolbar {
            border-top: 1px solid #e2e8f0 !important;
            border-left: 1px solid #e2e8f0 !important;
            border-right: 1px solid #e2e8f0 !important;
            border-bottom: none !important;
            border-radius: 6px 6px 0 0 !important;
          }
          .ql-container {
            border-bottom: 1px solid #e2e8f0 !important;
            border-left: 1px solid #e2e8f0 !important;
            border-right: 1px solid #e2e8f0 !important;
            border-top: none !important;
            border-radius: 0 0 6px 6px !important;
            font-size: 14px !important;
          }
          .ql-editor {
            padding: 12px !important;
            min-height: 150px !important;
          }
          .ql-editor.ql-blank::before {
            color: #9ca3af !important;
            font-style: normal !important;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;