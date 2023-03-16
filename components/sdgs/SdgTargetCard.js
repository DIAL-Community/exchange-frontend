import React, { useCallback } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'

const SdgTargetCard = ({ sdgTarget }) => {

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <Link
      key={sdgTarget.sustainableDevelopmentGoal?.id}
      href={`/sdgs/${sdgTarget.sustainableDevelopmentGoal?.slug}`}
      passHref
    >
      <div
        className={`
          border-3 border-transparent hover:border-dial-sunshine text-use-case
          hover:text-dial-sunshine cursor-pointer
        `}
      >
        <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
          <div className='flex flex-row text-dial-gray-dark'>
            <div className='px-4 my-auto text-sm font-semibold text-dial-sunshine w-3/12 md:w-2/12'>
              {`${format('sdg.target.title')}: ${sdgTarget.targetNumber}`}
            </div>
            <div className='my-2 text-sm w-9/12 md:w-10/12'>
              {sdgTarget.name}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SdgTargetCard
