import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'
import { SearchInput } from '../../shared/SearchInput'
import { generateMessageTypeOptions } from './constant'

const MessageFilter = ({ search, setSearch, setMessageType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const ALL_MESSAGE_TYPE = { label: 'All', 'value': '' }
  const [selectedMessageType, setSelectedMessageType] = useState(ALL_MESSAGE_TYPE)

  const handleSearchChange = (e) => setSearch(e.target.value)
  const handleMessageTypeChange = (e) => {
    setSelectedMessageType(e)
    setMessageType(e.value)
  }

  const messageTypeOptions = [
    ALL_MESSAGE_TYPE,
    ...generateMessageTypeOptions(format)
  ]

  return (
    <div className='flex flex-col gap-4 lg:gap-8 lg:flex-row text-sm'>
      <div className='lg:basis-1/2 shrink-0'>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder={format('app.search')}
        />
      </div>
      <div className='flex w-full'>
        <div className='basis-1/2 shrink-0 my-auto text-right px-4'>
          {format('dpi.broadcast.messageType')}
        </div>
        <Select
          isBorderless
          className='basis-1/2 shrink-0'
          options={messageTypeOptions}
          placeholder={format('dpi.broadcast.messageType')}
          onChange={handleMessageTypeChange}
          value={selectedMessageType}
        />
      </div>
    </div>
  )
}

export default MessageFilter
