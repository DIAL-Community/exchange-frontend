import classNames from 'classnames'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

const CalloutCard = ({ disabled, item }) => {
  const { extendedData: { title, description, calloutText, calloutDestinationUrl } } = item

  const isInternalUrl = (calloutDestinationUrl) => {
    return calloutDestinationUrl.startsWith('/')
  }

  return (
    <div className='px-8 pt-6 pb-8 h-full rounded-md shadow-lg border '>
      <div className='flex flex-col gap-4 h-full'>
        <div className='flex flex-row gap-x-3'>
          <div className='text-lg font-medium my-auto flex-grow'>
            {title && <FormattedMessage id={title} defaultMessage={title} />}
          </div>
        </div>
        <div className='text-sm flex-grow'>
          {description && <FormattedMessage id={description} defaultMessage={description} />}
        </div>
        {calloutDestinationUrl &&
          <div className='flex text-sm text-white'>
            {isInternalUrl(calloutDestinationUrl)
              ? (
                <Link
                  href={calloutDestinationUrl}
                  className={classNames(
                    'bg-dial-plum px-3 py-2 rounded-md',
                    disabled || !calloutDestinationUrl ? 'cursor-default' : 'cursor-pointer'
                  )}
                  onClick={(e) => { if (disabled || !calloutDestinationUrl) e.preventDefault() }}
                >
                  {calloutText && <FormattedMessage id={calloutText} defaultMessage={calloutText} />}
                </Link>
              )
              : (
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`//${calloutDestinationUrl}`}
                  className={classNames(
                    'bg-dial-plum px-3 py-2 rounded-md',
                    disabled || !calloutDestinationUrl ? 'cursor-default' : 'cursor-pointer'
                  )}
                  onClick={(e) => { if (disabled || !calloutDestinationUrl) e.preventDefault() }}
                >
                  {calloutText && <FormattedMessage id={calloutText} defaultMessage={calloutText} />}
                </a>
              )
            }
          </div>
        }
      </div>
    </div>
  )
}

export default CalloutCard
