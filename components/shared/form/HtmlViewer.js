import React from 'react'
import LexicalApp from '../lexical/LexicalApp'

export const HtmlViewer = ({ initialContent }) => {

  // eslint-disable-next-line
  const onChange = (html) => {
    // NO-OP
  }

  return (
    <LexicalApp
      editable={false}
      initialHtml={initialContent}
      onHtmlChanged={onChange}
    />
  )
}
