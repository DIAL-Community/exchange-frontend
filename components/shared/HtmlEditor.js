import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export const HtmlEditor = ({ onChange, initialContent, initInstanceCallback, editorId }) => {
  const editorRef = useRef(null)
  const handleEditorChange = (editor) => onChange(editor)

  return (
    <>
      <Editor
        id={editorId || 'TinyMCE-Editor'}
        apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
        onInit={(_evt, editor) => { editorRef.current = editor }}
        value={initialContent}
        onEditorChange={handleEditorChange}
        init={{
          selector: '#' + editorId ? editorId : 'TinyMCE-Editor',
          menubar: false,
          plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template imagetools codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons',
          toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview | insertfile image media link anchor codesample | ltr rtl',
          toolbar_sticky: true,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          init_instance_callback: initInstanceCallback,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          images_upload_url: process.env.NEXT_PUBLIC_RAILS_SERVER + '/images/upload'
        }}
      />
    </>
  )
}
