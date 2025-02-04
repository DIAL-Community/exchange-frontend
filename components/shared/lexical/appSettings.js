/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isDebugLoggingEnabled } from '../../utils/utilities'

export const DEFAULT_SETTINGS = {
  disableBeforeInput: false,
  emptyEditor: true,
  hasLinkAttributes: false,
  isAutocomplete: true,
  isCharLimit: false,
  isCharLimitUtf8: false,
  isCollab: false,
  isMaxLength: false,
  isRichText: true,
  measureTypingPerf: false,
  selectionAlwaysOnDisplay: false,
  shouldAllowHighlightingWithBrackets: false,
  shouldPreserveNewLinesInMarkdown: false,
  shouldUseLexicalContextMenu: false,
  showNestedEditorTreeView: false,
  showTableOfContents: false,
  showTreeView: isDebugLoggingEnabled(),
  tableCellBackgroundColor: true,
  tableCellMerge: true,
  tableHorizontalScroll: true
}

// These are mutated in setupEnv
export const INITIAL_SETTINGS = {
  ...DEFAULT_SETTINGS
}
