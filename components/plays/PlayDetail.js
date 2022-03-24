import { useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'

import { useRouter } from 'next/router'
import MoveDetail from '../playbooks/MoveDetail'
import BuildingBlockCard from '../building-blocks/BuildingBlockCard'
import ProductCard from '../products/ProductCard'

const PlayDetail = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { locale } = useRouter()
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    return `/${locale}/plays/${play.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[play.slug] = play.name
    return map
  })()

  return (
    <>
      <div className='flex flex-col gap-3 pb-8 max-w-screen-lg'>
        <div className='flex'>
          <div className='hidden lg:block'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
          <div className='w-full flex justify-end mt-4'>
            {
              session && (
                <div className='inline'>
                  {
                    session.user.canEdit && (
                      <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                        <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                        <span className='text-sm px-2'>{format('app.edit')}</span>
                      </a>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
        <div className='font-semibold text-2xl py-3'>
          {`${format('plays.label')}. ${play.name}`}
        </div>
        <div className='fr-view tinyEditor text-dial-gray-dark'>
          {ReactHtmlParser(play.playDescription?.description)}
        </div>
        <div className='flex flex-col gap-3'>
          {
            play.playMoves.map((move, i) => <MoveDetail key={i} moveSlug={move.slug} moveName={move.name} />)
          }
        </div>
        {
          play.buildingBlocks && play.buildingBlocks.length > 0 &&
            <div className='flex flex-col gap-3 my-3'>
              <div className='h4'>{format('building-block.header')}</div>
              <div
                className='text-sm'
                dangerouslySetInnerHTML={{ __html: format('play.buildingBlocks.subtitle') }}
              />
              {play.buildingBlocks.map((bb, i) => <BuildingBlockCard key={i} buildingBlock={bb} listType='list' />)}
            </div>
        }
        {
          play.products && play.products.length > 0 &&
            <div className='flex flex-col gap-3 my-3'>
              <div className='h4'>{format('product.header')}</div>
              <div
                className='text-sm'
                dangerouslySetInnerHTML={{ __html: format('play.products.subtitle') }}
              />
              {play.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
            </div>
        }
      </div>
    </>
  )
}

export default PlayDetail
