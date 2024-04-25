import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { FaSpinner } from 'react-icons/fa6'
import { Editor } from '@tinymce/tinymce-react'

export const HtmlViewer = ({ initialContent, editorId, className, fontSize, lineHeight }) => {
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(true)

  return (
    <div className='relative'>
      {loading && (
        <FaSpinner size='2em' className='absolute text-lg inset-x-1/2 top-10 spinner' />
      )}
      <div className='html-react-parser-viewer text-base'>
        {initialContent && parse(initialContent)}
      </div>
      <div className={classNames(className, 'html-viewer')}>
        <Editor
          id={editorId || 'tinymce-editor'}
          apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
          onInit={(_, editor) => {
            setLoading(false)
            editorRef.current = editor
          }}
          value={initialContent}
          init={{
            min_height: 72,
            selector: '#' + editorId ?? 'tinymce-editor',
            menubar: false,
            toolbar: false,
            statusbar: false,
            plugins: 'autoresize',
            content_style: `
              html {
              }

              body {
                margin: 0;
                font-family: 'Poppins', sans-serif;
                /* Using text-base from tailwind */
                font-size: ${fontSize ?? '1rem'};
                line-height: ${lineHeight ?? '1.5rem'};
                overflow: auto;
              }

              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                margin-left: 1rem;
                color: #dfdfea;
              }

              .mce-content-body > p:first-child {
                margin: 0;
              }

              .mce-content-body > #stakeholders {
                font-size: 1.125rem;
                line-height: 1.75rem;
              }
            `,
            branding: false
          }}
          disabled
        />
      </div>
    </div>
  )
}
