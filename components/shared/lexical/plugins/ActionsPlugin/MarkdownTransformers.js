/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createLineBreakNode, $createTextNode, $isTextNode } from 'lexical'
import { $createCodeNode, $isCodeNode, CodeNode } from '@lexical/code'
import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link'
import { $createListItemNode, $createListNode, $isListItemNode, $isListNode, ListItemNode, ListNode } from '@lexical/list'
import {
  $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingNode, QuoteNode
} from '@lexical/rich-text'

const ORDERED_LIST_REGEX = /^(\s*)(\d{1,})\.\s/
const UNORDERED_LIST_REGEX = /^(\s*)[-*+]\s/
const CHECK_LIST_REGEX = /^(\s*)(?:-\s)?\s?(\[(\s|x)?\])\s/i
const HEADING_REGEX = /^(#{1,6})\s/
const QUOTE_REGEX = /^>\s/
const CODE_START_REGEX = /^[ \t]*```(\w+)?/
const CODE_END_REGEX = /[ \t]*```$/
const CODE_SINGLE_LINE_REGEX = /^[ \t]*```[^`]+(?:(?:`{1,2}|`{4,})[^`]+)*```(?:[^`]|$)/
const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/

const createBlockNode = createNode => {
  return (parentNode, children, match) => {
    const node = createNode(match)
    node.append(...children)
    parentNode.replace(node)
    node.select(0, 0)
  }
}

// Amount of spaces that define indentation level
// TODO: should be an option
const LIST_INDENT_SIZE = 4

function getIndent(whitespaces) {
  const tabs = whitespaces.match(/\t/g)
  const spaces = whitespaces.match(/ /g)

  let indent = 0

  if (tabs) {
    indent += tabs.length
  }

  if (spaces) {
    indent += Math.floor(spaces.length / LIST_INDENT_SIZE)
  }

  return indent
}

const listReplace = listType => {
  return (parentNode, children, match) => {
    const previousNode = parentNode.getPreviousSibling()
    const nextNode = parentNode.getNextSibling()
    const listItem = $createListItemNode(
      listType === 'check' ? match[3] === 'x' : undefined
    )
    if ($isListNode(nextNode) && nextNode.getListType() === listType) {
      const firstChild = nextNode.getFirstChild()
      if (firstChild !== null) {
        firstChild.insertBefore(listItem)
      } else {
        // should never happen, but let's handle gracefully, just in case.
        nextNode.append(listItem)
      }

      parentNode.remove()
    } else if (
      $isListNode(previousNode) &&
      previousNode.getListType() === listType
    ) {
      previousNode.append(listItem)
      parentNode.remove()
    } else {
      const list = $createListNode(
        listType,
        listType === 'number' ? Number(match[2]) : undefined
      )
      list.append(listItem)
      parentNode.replace(list)
    }

    listItem.append(...children)
    listItem.select(0, 0)
    const indent = getIndent(match[1])
    if (indent) {
      listItem.setIndent(indent)
    }
  }
}

const listExport = (listNode, exportChildren, depth) => {
  const output = []
  const children = listNode.getChildren()
  let index = 0
  for (const listItemNode of children) {
    if ($isListItemNode(listItemNode)) {
      if (listItemNode.getChildrenSize() === 1) {
        const firstChild = listItemNode.getFirstChild()
        if ($isListNode(firstChild)) {
          output.push(listExport(firstChild, exportChildren, depth + 1))
          continue
        }
      }

      const indent = ' '.repeat(depth * LIST_INDENT_SIZE)
      const listType = listNode.getListType()
      const prefix =
        listType === 'number'
          ? `${listNode.getStart() + index}. `
          : listType === 'check'
            ? `- [${listItemNode.getChecked() ? 'x' : ' '}] `
            : '- '
      output.push(indent + prefix + exportChildren(listItemNode))
      index++
    }
  }

  return output.join('\n')
}

export const HEADING = {
  dependencies: [HeadingNode],
  export: (node, exportChildren) => {
    if (!$isHeadingNode(node)) {
      return null
    }

    const level = Number(node.getTag().slice(1))

    return '#'.repeat(level) + ' ' + exportChildren(node)
  },
  regExp: HEADING_REGEX,
  replace: createBlockNode(match => {
    const tag = 'h' + match[1].length

    return $createHeadingNode(tag)
  }),
  type: 'element'
}

export const QUOTE = {
  dependencies: [QuoteNode],
  export: (node, exportChildren) => {
    if (!$isQuoteNode(node)) {
      return null
    }

    const lines = exportChildren(node).split('\n')
    const output = []
    for (const line of lines) {
      output.push('> ' + line)
    }

    return output.join('\n')
  },
  regExp: QUOTE_REGEX,
  replace: (parentNode, children, _match, isImport) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling()
      if ($isQuoteNode(previousNode)) {
        previousNode.splice(previousNode.getChildrenSize(), 0, [
          $createLineBreakNode(),
          ...children
        ])
        previousNode.select(0, 0)
        parentNode.remove()

        return
      }
    }

    const node = $createQuoteNode()
    node.append(...children)
    parentNode.replace(node)
    node.select(0, 0)
  },
  type: 'element'
}

export const CODE = {
  dependencies: [CodeNode],
  export: node => {
    if (!$isCodeNode(node)) {
      return null
    }

    const textContent = node.getTextContent()

    return (
      '```' +
      (node.getLanguage() || '') +
      (textContent ? '\n' + textContent : '') +
      '\n' +
      '```'
    )
  },
  regExpEnd: {
    optional: true,
    regExp: CODE_END_REGEX
  },
  regExpStart: CODE_START_REGEX,
  replace: (
    rootNode,
    children,
    startMatch,
    endMatch,
    linesInBetween,
    isImport
  ) => {
    let codeBlockNode
    let code

    if (!children && linesInBetween) {
      if (linesInBetween.length === 1) {
        // Single-line code blocks
        if (endMatch) {
          // End match on same line. Example: ```markdown hello```. markdown should not be considered the language here.
          codeBlockNode = $createCodeNode()
          code = startMatch[1] + linesInBetween[0]
        } else {
          // No end match. We should assume the language is next to the backticks and that code
          // will be typed on the next line in the future
          codeBlockNode = $createCodeNode(startMatch[1])
          code = linesInBetween[0].startsWith(' ')
            ? linesInBetween[0].slice(1)
            : linesInBetween[0]
        }
      } else {
        // Treat multi-line code blocks as if they always have an end match
        codeBlockNode = $createCodeNode(startMatch[1])

        if (linesInBetween[0].trim().length === 0) {
          // Filter out all start and end lines that are length 0 until we find the first line with content
          while (linesInBetween.length > 0 && !linesInBetween[0].length) {
            linesInBetween.shift()
          }
        } else {
          // The first line already has content => Remove the first space of the line if it exists
          linesInBetween[0] = linesInBetween[0].startsWith(' ')
            ? linesInBetween[0].slice(1)
            : linesInBetween[0]
        }

        // Filter out all end lines that are length 0 until we find the last line with content
        while (
          linesInBetween.length > 0 &&
          !linesInBetween[linesInBetween.length - 1].length
        ) {
          linesInBetween.pop()
        }

        code = linesInBetween.join('\n')
      }

      const textNode = $createTextNode(code)
      codeBlockNode.append(textNode)
      rootNode.append(codeBlockNode)
    } else if (children) {
      createBlockNode(match => {
        return $createCodeNode(match ? match[1] : undefined)
      })(rootNode, children, startMatch, isImport)
    }
  },
  type: 'multiline-element'
}

export const UNORDERED_LIST = {
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: UNORDERED_LIST_REGEX,
  replace: listReplace('bullet'),
  type: 'element'
}

export const CHECK_LIST = {
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: CHECK_LIST_REGEX,
  replace: listReplace('check'),
  type: 'element'
}

export const ORDERED_LIST = {
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: ORDERED_LIST_REGEX,
  replace: listReplace('number'),
  type: 'element'
}

export const INLINE_CODE = {
  format: ['code'],
  tag: '`',
  type: 'text-format'
}

export const HIGHLIGHT = {
  format: ['highlight'],
  tag: '==',
  type: 'text-format'
}

export const BOLD_ITALIC_STAR = {
  format: ['bold', 'italic'],
  tag: '***',
  type: 'text-format'
}

export const BOLD_ITALIC_UNDERSCORE = {
  format: ['bold', 'italic'],
  intraword: false,
  tag: '___',
  type: 'text-format'
}

export const BOLD_STAR = {
  format: ['bold'],
  tag: '**',
  type: 'text-format'
}

export const BOLD_UNDERSCORE = {
  format: ['bold'],
  intraword: false,
  tag: '__',
  type: 'text-format'
}

export const STRIKETHROUGH = {
  format: ['strikethrough'],
  tag: '~~',
  type: 'text-format'
}

export const ITALIC_STAR = {
  format: ['italic'],
  tag: '*',
  type: 'text-format'
}

export const ITALIC_UNDERSCORE = {
  format: ['italic'],
  intraword: false,
  tag: '_',
  type: 'text-format'
}

// Order of text transformers matters:
//
// - code should go first as it prevents any transformations inside
// - then longer tags match (e.g. ** or __ should go before * or _)
export const LINK = {
  dependencies: [LinkNode],
  export: (node, exportChildren, exportFormat) => {
    if (!$isLinkNode(node)) {
      return null
    }

    const title = node.getTitle()
    const linkContent = title
      ? `[${node.getTextContent()}](${node.getURL()} '${title}')`
      : `[${node.getTextContent()}](${node.getURL()})`
    const firstChild = node.getFirstChild()
    // Add text styles only if link has single text node inside. If it's more
    // then one we ignore it as markdown does not support nested styles for links
    if (node.getChildrenSize() === 1 && $isTextNode(firstChild)) {
      return exportFormat(firstChild, linkContent)
    } else {
      return linkContent
    }
  },
  importRegExp: /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s'((?:[^']*\\')*[^']*)'\s*)?)\))/,
  regExp: /(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s'((?:[^']*\\')*[^']*)'\s*)?)\))$/,
  replace: (textNode, match) => {
    const [, linkText, linkUrl, linkTitle] = match
    const linkNode = $createLinkNode(linkUrl, { title: linkTitle })
    const linkTextNode = $createTextNode(linkText)
    linkTextNode.setFormat(textNode.getFormat())
    linkNode.append(linkTextNode)
    textNode.replace(linkNode)
  },
  trigger: ')',
  type: 'text-match'
}

export function normalizeMarkdown(input, shouldMergeAdjacentLines = false) {
  const lines = input.split('\n')
  let inCodeBlock = false
  const sanitizedLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lastLine = sanitizedLines[sanitizedLines.length - 1]

    // Code blocks of ```single line``` don't toggle the inCodeBlock flag
    if (CODE_SINGLE_LINE_REGEX.test(line)) {
      sanitizedLines.push(line)
      continue
    }

    // Detect the start or end of a code block
    if (CODE_START_REGEX.test(line) || CODE_END_REGEX.test(line)) {
      inCodeBlock = !inCodeBlock
      sanitizedLines.push(line)
      continue
    }

    // If we are inside a code block, keep the line unchanged
    if (inCodeBlock) {
      sanitizedLines.push(line)
      continue
    }

    // In markdown the concept of 'empty paragraphs' does not exist.
    // Blocks must be separated by an empty line. Non-empty adjacent lines must be merged.
    if (
      line === '' ||
      lastLine === '' ||
      !lastLine ||
      HEADING_REGEX.test(lastLine) ||
      HEADING_REGEX.test(line) ||
      QUOTE_REGEX.test(line) ||
      ORDERED_LIST_REGEX.test(line) ||
      UNORDERED_LIST_REGEX.test(line) ||
      CHECK_LIST_REGEX.test(line) ||
      TABLE_ROW_REG_EXP.test(line) ||
      TABLE_ROW_DIVIDER_REG_EXP.test(line) ||
      !shouldMergeAdjacentLines
    ) {
      sanitizedLines.push(line)
    } else {
      sanitizedLines[sanitizedLines.length - 1] = lastLine + line
    }
  }

  return sanitizedLines.join('\n')
}
