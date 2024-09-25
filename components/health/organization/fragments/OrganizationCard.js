import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../../../utils/constants'
import { isValidFn } from '../../../utils/utilities'

const OrganizationCard = ({ displayType, organization, dismissHandler, urlPrefix = null }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const textRef = useRef(null)
  const [lineClamp, setLineClamp] = useState(0)

  useEffect(() => {
    const adjustLineClamp = () => {
      if (textRef.current) {
        const element = textRef.current
        const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10)
        let height = element.offsetHeight - 10

        if (height > 79) {
          height = 79
        }

        if (height < 79 && height > 48) {
          height = 60
        }

        const lines = Math.floor(height / lineHeight)

        setLineClamp(lines)
      }
    }

    adjustLineClamp()
  }, [])

  const displayGridCard = () =>
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg border-3 border-transparent hover:border-dial-sunshine'>
      <div
        className='bg-white shadow-lg rounded-xl h-[320px] border border-dial-gray hover:border-transparent'>
        <div className="flex flex-col h-full">
          <div className="flex justify-center items-center py-12 bg-white rounded-xl
                          border-health-green border-4 mx-4 my-4 max-h-[180px]"
          >
            {organization.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-12 mx-16">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                  className="object-contain"
                />
              </div>
            }
            {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                  className="object-contain dial-meadow-filter"
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold m-auto text-health-blue title-truncate">
            {organization.name}
          </div>
          <div className="text-xs text-dial-stratos font-medium h-full overflow-hidden" ref={textRef}>
            <div className="px-6 py-2 flex  mx-auto gap-2">
              <span
                className="my-auto text-center m-auto dynamic-truncate break-words"
                style={{
                  WebkitLineClamp: lineClamp
                }}
              >
                {organization.parsedDescription}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className="relative">
      <Link href={`${urlPrefix ? urlPrefix : ''}/health/organizations/${organization.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
      </Link>
      <div className="absolute top-2 right-2">
        {isValidFn(dismissHandler) &&
          <button type='button'>
            <FaXmark size='1rem' className='text-dial-meadow' onClick={dismissHandler} />
          </button>
        }
      </div>
    </div>
  )
}

export default OrganizationCard
