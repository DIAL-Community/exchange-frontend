/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { validateUrl } from '../../utils/url'

export default function LinkPlugin({ hasLinkAttributes = false }) {
  return (
    <LexicalLinkPlugin
      validateUrl={validateUrl}
      attributes={
        hasLinkAttributes
          ? {
            rel: 'noopener noreferrer',
            target: '_blank'
          }
          : undefined
      }
    />
  )
}
