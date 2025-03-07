/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { $createFigmaNode, FigmaNode } from '../../nodes/FigmaNode'

export const INSERT_FIGMA_COMMAND = createCommand('INSERT_FIGMA_COMMAND')

export default function FigmaPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([FigmaNode])) {
      throw new Error('FigmaPlugin: FigmaNode not registered on editor')
    }

    return editor.registerCommand(
      INSERT_FIGMA_COMMAND,
      payload => {
        const figmaNode = $createFigmaNode(payload)
        $insertNodeToNearestRoot(figmaNode)

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
