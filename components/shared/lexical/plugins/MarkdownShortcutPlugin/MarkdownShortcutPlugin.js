/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers/MarkdownTransformers'

export default function MarkdownPlugin() {
  return <MarkdownShortcutPlugin transformers={PLAYGROUND_TRANSFORMERS} />
}
