/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { MarkNode } from '@lexical/mark'
import { OverflowNode } from '@lexical/overflow'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { CollapsibleContainerNode } from '../plugins/CollapsiblePlugin/CollapsibleContainerNode'
import { CollapsibleContentNode } from '../plugins/CollapsiblePlugin/CollapsibleContentNode'
import { CollapsibleTitleNode } from '../plugins/CollapsiblePlugin/CollapsibleTitleNode'
import { AutocompleteNode } from './AutocompleteNode'
import { EmojiNode } from './EmojiNode'
import { ImageNode } from './ImageNode'
import { InlineImageNode } from './InlineImageNode/InlineImageNode'
import { KeywordNode } from './KeywordNode'
import { LayoutContainerNode } from './LayoutContainerNode'
import { LayoutItemNode } from './LayoutItemNode'
import { PageBreakNode } from './PageBreakNode/PageBreakNode'
import { PollNode } from './PollNode'
import { SpecialTextNode } from './SpecialTextNode'
import { YouTubeNode } from './YouTubeNode'

const PlaygroundNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  PollNode,
  ImageNode,
  InlineImageNode,
  EmojiNode,
  AutocompleteNode,
  KeywordNode,
  HorizontalRuleNode,
  YouTubeNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  PageBreakNode,
  LayoutContainerNode,
  LayoutItemNode,
  SpecialTextNode
]

export default PlaygroundNodes
