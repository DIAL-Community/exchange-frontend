import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import parse from 'html-react-parser'
import { HiExternalLink } from 'react-icons/hi'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'

export const MOVE_QUERY = gql`
  query Move($playSlug: String!, $slug: String!) {
    move(playSlug: $playSlug, slug: $slug) {
      id
      slug
      name
      resources
      order
      moveDescription {
        id
        description
      }
    }
  }
`

const PlayPreviewMove = ({ moveName, moveSlug, playSlug, pdf = false }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [openingDetail, setOpeningDetail] = useState(pdf)

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  const { locale } = useRouter()

  const { data } = useQuery(MOVE_QUERY, {
    variables: { playSlug, slug: moveSlug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !moveSlug
  })

  return (
    <>
      {
        data &&
          <div className='flex flex-col border border-dial-orange-light'>
            <div className='move-header cursor-pointer' onClick={toggleDetail}>
              <div className='move-animation-base bg-dial-yellow-light h-14' />
              <div
                className={`
                  animated-move
                  ${openingDetail ? 'move-header-expanded' : 'move-header-collapsed'}
                  move-animation bg-dial-orange-light h-14
                `}
              />
              <div className='flex move-header'>
                <div className='font-semibold px-4 py-4 my-auto'>{moveName}</div>
                <div className='ml-auto my-auto px-4'>
                  {openingDetail ? <BsChevronUp /> : <BsChevronDown />}
                </div>
              </div>
            </div>
            <div className={`move-body ${openingDetail ? 'slide-down' : 'slide-up'}`}>
              <div className='px-4 py-4'>
                <div className='fr-view text-dial-gray-dark'>
                  {data?.move?.moveDescription && parse(data.move.moveDescription.description)}
                </div>
                {
                  data?.move?.resources && data?.move?.resources.length > 0 &&
                    <>
                      <div className='font-semibold py-2'>{format('move.resources.header')}</div>
                      <div className='flex flex-wrap gap-3'>
                        {
                          data?.move?.resources.map(resource => {
                            return (
                              <Link key={resource.i} href={resource.url} passHref>
                                <a target='_blank' rel='noreferrer'>
                                  <div key={resource.i} className='group border-2 border-gray-300 hover:border-dial-yellow card-drop-shadow'>
                                    <div className='flex'>
                                      <div className='flex flex-col gap-2 px-3 py-4'>
                                        <div className='font-semibold'>{resource.name}</div>
                                        <div className='text-sm'>{resource.description}</div>
                                      </div>
                                      <HiExternalLink className='ml-auto px-2' size='2.2em' />
                                    </div>
                                  </div>
                                </a>
                              </Link>
                            )
                          })
                        }
                      </div>
                    </>
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default PlayPreviewMove
