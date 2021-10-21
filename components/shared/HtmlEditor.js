import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export const HtmlEditor = ({ updateText, initialContent, initInstanceCallback }) => {

  const editorRef = useRef(null)
  const setContents = (newValue, editor) => {
    if (editorRef.current) {
      updateText(newValue, editor)
    }
  }

  return (
    <>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
        onInit={(evt, editor) => editorRef.current = editor}
        value={initialContent}
        onEditorChange={(newValue, editor) => setContents(newValue, editor)}
        init={{
          menubar: false,
          plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
          menubar: 'file edit view insert format tools table help',
          toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
          toolbar_sticky: true,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          init_instance_callback: initInstanceCallback
        }}
      />
    </>
  )
}
