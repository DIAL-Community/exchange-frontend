import LexicalApp from '../lexical/LexicalApp'

// https://github.com/facebook/lexical/discussions/2406
export const HtmlEditor = ({ labelledBy, describedBy, placeholder, initialContent, onChange }) => {
  return (
    <LexicalApp
      editable={true}
      labelledBy={labelledBy}
      describedBy={describedBy}
      placeholder={placeholder}
      initialHtml={initialContent}
      onHtmlChanged={onChange}
    />
  )
}
