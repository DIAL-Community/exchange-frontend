import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import { FaSpinner } from 'react-icons/fa6'
import { Editor } from '@tinymce/tinymce-react'

export const HtmlEditor = ({
  onChange,
  initialContent,
  initInstanceCallback,
  editorId,
  placeholder,
  className,
  fontSize,
  lineHeight,
  isInvalid = false
}) => {
  const editorRef = useRef(null)
  const handleEditorChange = (editor) => onChange(editor)

  const [loading, setLoading] = useState(true)

  return (
    <div className='relative'>
      {loading && (
        <FaSpinner size='2em' className='absolute text-lg inset-x-1/2 top-10 spinner' />
      )}
      <div className={classNames({ 'validation-error': isInvalid }, className, 'html-editor')}>
        <Editor
          id={editorId || 'tinymce-editor'}
          apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
          onInit={(_, editor) => {
            setLoading(false)
            editorRef.current = editor
          }}
          value={initialContent}
          onEditorChange={handleEditorChange}
          init={{
            max_height: 400,
            min_height: 240,
            autoresize_overflow_padding: 16,
            selector: '#' + editorId ?? 'tinymce-editor',
            menubar: false,
            plugins: `preview importcss searchreplace autolink autosave save directionality
              code visualblocks visualchars fullscreen image link media codesample
              table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount
              help charmap quickbars emoticons autoresize
            `,
            toolbar1: `
              undo redo | fontfamily fontsize lineheight | bold italic underline strikethrough forecolor backcolor |
              link insertfile image media codesample`,
            toolbar2: `
              alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat |
              ltr rtl | charmap emoticons
            `,
            line_height_formats: '1 1.25 1.5 1.75 2 2.25 2.5',
            font_size_formats: '12pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt 48pt',
            contextmenu: false,
            toolbar_sticky: true,
            content_style: `
              html {
                height: 100%
              }
              body {
                font-family: 'Poppins', sans-serif;
                /* Using text-base from tailwind */
                font-size: ${fontSize ?? '1rem'};
                line-height: ${lineHeight ?? '1.5rem'};
              }
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                margin-left: 1rem;
                color: #dfdfea;
              }
              .mce-content-body > p {
                margin: 0;
                padding-bottom: 1rem;
              }
            `,
            init_instance_callback: initInstanceCallback,
            image_title: true,
            file_picker_types: 'image',
            branding: false,
            setup(editor) {
              editor.on('focus', () => editor.container?.classList.add('focused'))
              editor.on('blur', () => editor.container?.classList.remove('focused'))
            },
            placeholder,
            browser_spellcheck: true
          }}
        />
      </div>
    </div>
  )
}
