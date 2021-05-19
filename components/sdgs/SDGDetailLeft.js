import { useIntl } from 'react-intl'

const SDGDetailLeft = ({ sdg }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <>
      <div className='h-20'>
        <div className='w-full'>
          <img src='/icons/comment.svg' className='inline mr-2' alt='Edit' height='15px' width='15px' />
          <div className='text-dial-blue inline'>{format('app.comment')}</div>
        </div>
        <div className='h4 font-bold py-4'>{format('sdg.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray mr-6 shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-80 bg-white bg-opacity-80'>
            {sdg.name}
          </div>
          <div className='pt-8 m-auto align-middle w-48'>
            <img
              alt={`Logo for ${sdg.name}`}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
            />
          </div>
          <div className='text-sm text-center'>
            {sdg.longTitle}
          </div>
        </div>
      </div>
    </>
  )
}

export default SDGDetailLeft
