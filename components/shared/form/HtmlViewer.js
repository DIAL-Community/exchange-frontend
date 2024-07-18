import React from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'

export const HtmlViewer = ({ initialContent, extraClassNames = 'text-base' }) => {

  return (
    <div className='relative'>
      <div className={classNames('html-react-parser-viewer', extraClassNames)}>
        {initialContent && parse(initialContent)}
      </div>
    </div>
  )
}
