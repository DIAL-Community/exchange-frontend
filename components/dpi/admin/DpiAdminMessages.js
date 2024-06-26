import { useCallback, useState } from 'react'
import Link from 'next/link'
import { FiPlusCircle } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import MessageFilter from '../message/MessageFilter'
import MessageList from '../message/MessageList'
import MessagePagination from '../message/MessagePagination'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminMessages = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const { user } = useUser()

  const [search, setSearch] = useState()
  const [messageType, setMessageType] = useState()

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className="md:flex md:h-full">
        <DpiAdminTabs />
        <div className="p-12 text-medium text-dial-slate-400 bg-dial-slate-800 rounded-lg w-full h-full">
          <div className='message-list-section text-dial-cotton relative flex flex-col gap-4'>
            <div className='absolute top-0 right-0'>
              {(user.isAdminUser || user.isAdliAdminUser) &&
                <div className='flex items-center'>
                  <Link
                    href={'/dpi-admin/broadcasts/create'}
                    className='cursor-pointer bg-dial-iris-blue px-4 py-2 rounded text-dial-cotton'
                  >
                    <FiPlusCircle className='inline pb-0.5' />
                    <span className='text-sm px-1'>
                      {format('app.create')}
                    </span>
                  </Link>
                </div>
              }
            </div>
            <div className='text-2xl pb-6'>
              {format('dpi.broadcast.header')}
            </div>
            <MessageFilter
              search={search}
              setSearch={setSearch}
              messageType={messageType}
              setMessageType={setMessageType}
            />
            <MessageList
              search={search}
              messageType={messageType}
              pageNumber={pageNumber}
            />
            <MessagePagination
              search={search}
              messageType={messageType}
              pageNumber={pageNumber}
              onClickHandler={onClickHandler}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DpiAdminMessages
