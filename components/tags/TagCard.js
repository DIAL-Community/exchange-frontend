import { useIntl } from 'react-intl'

const TagCard = ({ tag, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <>
      {listType === 'list'
        ? (
          <div className='border-3 border-transparent hover:border-dial-yellow text-button-gray hover:text-dial-yellow cursor-pointer'>
            <div className='border border-dial-gray hover:border-transparent card-drop-shadow'>
              <div className='flex justify-between my-5 px-4'>
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
