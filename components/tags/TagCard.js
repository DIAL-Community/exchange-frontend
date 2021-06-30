import { useIntl } from 'react-intl'

const TagCard = ({ tag, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  return (
    <>
      {listType === 'list'
        ? (
          <div className='border-3 border-transparent hover:border-dial-yellow text-button-gray hover:text-dial-yellow cursor-pointer'>
            <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
              <div className='flex justify-between my-4 px-4'>
                <div className='inline-block card-title card-link-text text-button-gray'>
                  {tag}
                </div>
              </div>
            </div>
          </div>
          )
        : <div>{format('tag.label')}</div>}
    </>
  )
}

export default TagCard