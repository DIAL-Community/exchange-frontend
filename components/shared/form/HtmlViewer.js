import React from 'react'
import LexicalApp from '../lexical/LexicalApp'

export const HtmlViewer = ({ initialContent }) => {

  const onChange = (html) => {
    console.log(html)
  }

  return (
    <LexicalApp editable={false} initialHtml={initialContent} onHtmlChanged={onChange} />
  )
}
