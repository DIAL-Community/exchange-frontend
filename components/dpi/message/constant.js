export const DPI_ANNOUNCEMENT_MESSAGE_TYPE = 'dpi_announcement'
export const DPI_EMAIL_MESSAGE_TYPE = 'dpi_email'
export const DPI_EVENT_MESSAGE_TYPE = 'dpi_event'

export const MESSAGE_PAGE_SIZE = 8

export const findMessageTypeLabel = (messageType, format) => {
  const messageTypeOption = generateMessageTypeOptions(format).find(({ value }) => {
    return value === messageType
  })

  return messageTypeOption?.label
}

export const generateMessageTypeOptions = (format) => {
  return [
    { label: format('dpi.broadcast.messageType.announcement'), value: DPI_ANNOUNCEMENT_MESSAGE_TYPE },
    { label: format('dpi.broadcast.messageType.email'), value: DPI_EMAIL_MESSAGE_TYPE },
    { label: format('dpi.broadcast.messageType.event'), value: DPI_EVENT_MESSAGE_TYPE }
  ]
}
