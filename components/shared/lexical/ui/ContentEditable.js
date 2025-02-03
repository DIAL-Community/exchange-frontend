/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './ContentEditable.module.css'

import { ContentEditable } from '@lexical/react/LexicalContentEditable'

export default function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName
}) {
  return (
    <ContentEditable
      className={className ?? 'ContentEditable__root'}
      aria-placeholder={placeholder}
      placeholder={
        <div className={placeholderClassName ?? 'ContentEditable__placeholder'}>
          {placeholder}
        </div>
      }
    />
  )
}
