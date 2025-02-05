/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import classNames from 'classnames'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

export default function LexicalContentEditable({
  className,
  placeholder,
  placeholderClassName
}) {

  const [editor] = useLexicalComposerContext()

  return (
    <ContentEditable
      className={classNames(
        className ?? 'ContentEditable__root',
        editor.isEditable() ? 'read-write' : 'read-only'
      )}
      aria-placeholder={placeholder}
      placeholder={
        <div className={placeholderClassName ?? 'ContentEditable__placeholder'}>
          {placeholder}
        </div>
      }
    />
  )
}
