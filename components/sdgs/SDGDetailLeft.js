import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Image from 'next/image'
import Breadcrumb from '../shared/breadcrumb'

const SDGDetailLeft = ({ sdg }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const slugNameMapping = (() => {
    const map = {}
    map[sdg.slug] = sdg.name

    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full'>
          <img src='/icons/comment.svg' className='inline mr-2' alt='Edit' height='15px' width='15px' />
          <div className='text-dial-blue inline'>{format('app.comment')}</div>
        </div>
        <div className='h4 font-bold py-4'>{format('sdg.label')}</div>
      </div>
      <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
        <div className='flex flex-col h-80 p-4'>
          <div
            className={`
              text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80
              bg-white bg-opacity-80 text-dial-purple
            `}
          >
            {sdg.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative' >
            <Image
              fill
              className='p-2 m-auto object-contain'
              alt={format('image.alt.logoFor', { name: sdg.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
            />
          </div>
          <div className='text-sm text-center text-dial-gray-dark'>
            {sdg.longTitle}
          </div>
        </div>
      </div>
    </>
  )
}

export default SDGDetailLeft
