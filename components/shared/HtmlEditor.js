import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa'

export const HtmlEditor = ({ onChange, initialContent, initInstanceCallback, editorId, placeholder, className, isInvalid = false }) => {
  const editorRef = useRef(null)
  const handleEditorChange = (editor) => onChange(editor)

  const [loading, setLoading] = useState(true)

  return (
    <div className='relative'>
      {loading && (
        <FaSpinner size='2em' className='absolute text-lg inset-x-1/2 top-10 spinner' />
      )}
      <div className={classNames({ 'validation-error': isInvalid }, className, 'htmlEditor')}>
        <Editor
          id={editorId || 'TinyMCE-Editor'}
          apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
          onInit={(_, editor) => {
            setLoading(false)
            editorRef.current = editor
          }}
          value={initialContent}
          onEditorChange={handleEditorChange}
          init={{
            selector: '#' + editorId ?? 'TinyMCE-Editor',
            menubar: false,
            plugins: `print preview paste importcss searchreplace autolink autosave save directionality
              code visualblocks visualchars fullscreen image link media template codesample
              table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount
              textpattern noneditable help charmap quickbars emoticons`,
            toolbar: `undo redo | bold italic underline strikethrough | fontselect fontsizeselect |
              alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist |
              forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview |
              insertfile image media link anchor codesample | ltr rtl`,
            toolbar_sticky: true,
            content_style: `
              body { font-family: Arial; font-size: 18px }
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                color: #dfdfea;
              }
            `,
            init_instance_callback: initInstanceCallback,
            image_title: true,
            automatic_uploads: true,
            file_picker_types: 'image',
            images_upload_url: process.env.NEXT_PUBLIC_RAILS_SERVER + '/images/upload',
            branding: false,
            setup(editor) {
              editor.on('focus', () => editor.container?.classList.add('focused'))
              editor.on('blur', () => editor.container?.classList.remove('focused'))
            },
            placeholder
          }}
        />
      </div>
    </div>
  )
}
