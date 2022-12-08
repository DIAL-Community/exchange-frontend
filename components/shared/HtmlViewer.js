import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa'

export const HtmlViewer = ({ initialContent, editorId, className }) => {
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(true)

  return (
    <div className='relative'>
      {loading && (
        <FaSpinner size='2em' className='absolute text-lg inset-x-1/2 top-10 spinner' />
      )}
      <div className={classNames(className, 'html-viewer')}>
        <Editor
          id={editorId || 'TinyMCE-Editor'}
          apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
          onInit={(_, editor) => {
            setLoading(false)
            editorRef.current = editor
          }}
          value={initialContent}
          init={{
            selector: '#' + editorId ?? 'TinyMCE-Editor',
            menubar: false,
            toolbar: false,
            statusbar: false,
            plugins: 'wordcount autoresize',
            branding: false,
            content_style: 'body { margin: 0px !important;}',
          }}
          disabled
        />
      </div>
    </div>
  )
}
