import Link from 'next/link'
import ReactHtmlParser from 'react-html-parser'

const SDGCard = ({ sdg, listType }) => {
  return (
    <Link href={`/sdgs/${sdg.id}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='flex justify-between my-4 px-4'>
                  <div className='inline-block card-title truncate card-link-text text-sdg'>
                    <img className='inline pr-4' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}`} alt={sdg.imageFile} width='40' height='40' />
                    {sdg.name}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='bg-white border-2 border-dial-gray p-6 tracking-wide shadow-lg'>
              <div id='header' className='flex items-center mb-4'>
                <img alt='avatar' className='w-20 rounded-full border-2 border-gray-300' src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile} />
                <div id='header-text' className='leading-5 ml-6 sm'>
                  <h4 id='name' className='text-xl font-semibold'>{sdg.name}</h4>
                </div>
              </div>
              <div id='quote' className='italic text-gray-600'>
                {sdg.longTitle}
              </div>
            </div>
            )
      }
    </Link>
  )
}

export default SDGCard
