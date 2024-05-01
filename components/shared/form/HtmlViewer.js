import React from 'react'
import parse from 'html-react-parser'

export const HtmlViewer = ({ initialContent }) => {

  return (
    <div className='relative'>
      <div className='html-react-parser-viewer text-base'>
        {initialContent && parse(initialContent)}
      </div>
    </div>
  )
}
