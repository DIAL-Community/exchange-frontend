import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export const HtmlEditor = ({ updateText, initialContent, initInstanceCallback }) => {

  const editorRef = useRef(null)
  const setContents = (newValue, editor) => {
    if (editorRef.current) {
      updateText(newValue, editor)
    }
  }

  const uploadImage = (cb, value, meta) => {
    var input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')

    input.onchange = function () {
      var file = this.files[0]

      var reader = new FileReader()
      reader.onload = function () {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        var id = 'blobid' + (new Date()).getTime()
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache
        var base64 = reader.result.split(',')[1]
        var blobInfo = blobCache.create(id, file, base64)
        blobCache.add(blobInfo)

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name })
      };
      reader.readAsDataURL(file)
    };

    input.click()
  }

  return (
    <>
      <Editor
        id='TinyMCE-Editor'
        apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
        onInit={(evt, editor) => editorRef.current = editor}
        value={initialContent}
        onEditorChange={(newValue, editor) => setContents(newValue, editor)}
        init={{
          menubar: false,
          plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template imagetools codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons',  // imagetools toc
          //menubar: 'file edit view insert format tools table help',
          toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview | insertfile image media link anchor codesample | ltr rtl',
          toolbar_sticky: true,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          init_instance_callback: initInstanceCallback,
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: uploadImage
        }}
      />
    </>
  )
}
