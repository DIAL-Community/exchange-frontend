/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { SelectionAlwaysOnDisplay } from '@lexical/react/LexicalSelectionAlwaysOnDisplay'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { useSettings } from './context/SettingsContext'
import { useSharedHistoryContext } from './context/SharedHistoryContext'
import ActionsPlugin from './plugins/ActionsPlugin/ActionsPlugin'
import AutocompletePlugin from './plugins/AutocompletePlugin/AutocompletePlugin'
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin/AutoEmbedPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin/AutoLinkPlugin'
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin/CodeActionMenuPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin/CodeHighlightPlugin'
import CollapsiblePlugin from './plugins/CollapsiblePlugin/CollapsiblePlugin'
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin/ComponentPickerPlugin'
import ContextMenuPlugin from './plugins/ContextMenuPlugin/ContextMenuPlugin'
import DragDropPaste from './plugins/DragDropPastePlugin/DragDropPastePlugin'
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin/DraggableBlockPlugin'
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin/EmojiPickerPlugin'
import EmojisPlugin from './plugins/EmojisPlugin/EmojisPlugin'
import EquationsPlugin from './plugins/EquationsPlugin/EquationsPlugin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin/FloatingLinkEditorPlugin'
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin/FloatingTextFormatToolbarPlugin'
import HtmlWatcherPlugin from './plugins/HtmlWatcherPlugin/HtmlWatcherPlugin'
import KeywordsPlugin from './plugins/KeywordsPlugin/KeywordsPlugin'
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin'
import LinkPlugin from './plugins/LinkPlugin/LinkPlugin'
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin/MarkdownShortcutPlugin'
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin/MaxLengthPlugin'
import PageBreakPlugin from './plugins/PageBreakPlugin/PageBreakPlugin'
import PollPlugin from './plugins/PollPlugin/PollPlugin'
import ShortcutsPlugin from './plugins/ShortcutsPlugin/ShortcutsPlugin'
import SpecialTextPlugin from './plugins/SpecialTextPlugin/SpecialTextPlugin'
import TabFocusPlugin from './plugins/TabFocusPlugin/TabFocusPlugin'
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin/TableActionMenuPlugin'
import TableCellResizer from './plugins/TableCellResizer/TableCellResizer'
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin/TableHoverActionsPlugin'
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin/TableOfContentsPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin/ToolbarPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin/TreeViewPlugin'
import YouTubePlugin from './plugins/YouTubePlugin/YouTubePlugin'
import { CAN_USE_DOM } from './shared/canUseDOM'
import ContentEditable from './ui/ContentEditable'

const SpeechToTextPlugin = dynamic(
  async () => await import('./plugins/SpeechToTextPlugin/SpeechToTextPlugin'),
  { ssr: false }
)

const ImagesPlugin = dynamic(
  async () => await import('./plugins/ImagesPlugin/ImagesPlugin'),
  { ssr: false }
)

const InlineImagePlugin = dynamic(
  async () => await import('./plugins/InlineImagePlugin/InlineImagePlugin'),
  { ssr: false }
)

export default function LexicalEditor({ labelledBy, describedBy, placeholder, initialHtml, onHtmlChanged }) {
  const { historyState } = useSharedHistoryContext()
  const {
    settings: {
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      hasLinkAttributes,
      isCharLimitUtf8,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      shouldPreserveNewLinesInMarkdown,
      tableCellMerge,
      tableCellBackgroundColor,
      tableHorizontalScroll,
      shouldAllowHighlightingWithBrackets,
      selectionAlwaysOnDisplay
    }
  } = useSettings()
  const isEditable = useLexicalEditable()
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null)
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false)
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)

  const onRef = _floatingAnchorElem => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport)
      }
    }

    updateViewPortWidth()
    window.addEventListener('resize', updateViewPortWidth)

    return () => {
      window.removeEventListener('resize', updateViewPortWidth)
    }
  }, [isSmallWidthViewport])

  return (
    <>
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <ShortcutsPlugin
        editor={activeEditor}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <div className={`editor-container ${showTreeView ? 'tree-view' : ''}`}>
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        {selectionAlwaysOnDisplay && <SelectionAlwaysOnDisplay />}
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        <HistoryPlugin externalHistoryState={historyState} />
        <HtmlWatcherPlugin initialHtml={initialHtml} onHtmlChanged={onHtmlChanged} />
        <RichTextPlugin
          contentEditable={
            <div className='editor-scroller'>
              <div className='editor' ref={onRef}>
                <ContentEditable
                  labelledBy={labelledBy}
                  describedBy={describedBy}
                  placeholder={placeholder}
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownShortcutPlugin />
        <CodeHighlightPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <TablePlugin
          hasCellMerge={tableCellMerge}
          hasCellBackgroundColor={tableCellBackgroundColor}
          hasHorizontalScroll={tableHorizontalScroll}
        />
        <TableCellResizer />
        <ImagesPlugin />
        <InlineImagePlugin />
        <LinkPlugin hasLinkAttributes={hasLinkAttributes} />
        <PollPlugin />
        <YouTubePlugin />
        <ClickableLinkPlugin disabled={isEditable} />
        <HorizontalRulePlugin />
        <EquationsPlugin />
        <TabFocusPlugin />
        <TabIndentationPlugin maxIndent={7} />
        <CollapsiblePlugin />
        <PageBreakPlugin />
        <LayoutPlugin />
        {floatingAnchorElem && !isSmallWidthViewport && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <TableCellActionMenuPlugin
              anchorElem={floatingAnchorElem}
              cellMerge={true}
            />
            <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? 'UTF-16' : 'UTF-8'}
            maxLength={5}
          />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
        {shouldAllowHighlightingWithBrackets && <SpecialTextPlugin />}
        <ActionsPlugin
          shouldPreserveNewLinesInMarkdown={shouldPreserveNewLinesInMarkdown}
        />
      </div >
      {showTreeView && <TreeViewPlugin />
      }
    </>
  )
}
