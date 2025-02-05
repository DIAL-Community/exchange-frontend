import LexicalApp from '../lexical/LexicalApp'

// https://github.com/facebook/lexical/discussions/2406
export const HtmlEditor = ({ initialContent, onChange }) => {
  return (
    <LexicalApp
      editable={true}
      initialHtml={initialContent}
      onHtmlChanged={onChange}
    />
  )
}
