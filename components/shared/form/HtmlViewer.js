import React from 'react'
import LexicalApp from '../lexical/LexicalApp'

export const HtmlViewer = ({ initialContent, handleHtmlChanged }) => {

  // eslint-disable-next-line
  const onChange = (html) => {
    if (html !== initialContent && handleHtmlChanged) {
      handleHtmlChanged(html)
    }
  }

  return (
    <LexicalApp
      editable={false}
      initialHtml={initialContent}
      onHtmlChanged={onChange}
    />
  )
}
