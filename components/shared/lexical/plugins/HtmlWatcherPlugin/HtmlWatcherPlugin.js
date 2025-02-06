import { useEffect, useState } from 'react'
import { $insertNodes } from 'lexical'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'

const HtmlWatcherPlugin = ({ initialHtml, onHtmlChanged }) => {
  const [editor] = useLexicalComposerContext()

  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (!initialHtml || !isFirstRender) return

    setIsFirstRender(false)

    editor.update(() => {
      const parser = new DOMParser()
      const dom = parser.parseFromString(initialHtml, 'text/html')
      const nodes = $generateNodesFromDOM(editor, dom)
      $insertNodes(nodes)
    })
  }, [editor, initialHtml, isFirstRender])

  return (
    <OnChangePlugin
      onChange={editorState => {
        editorState.read(() => {
          onHtmlChanged($generateHtmlFromNodes(editor))
        })
      }}
    />
  )
}

export default HtmlWatcherPlugin
