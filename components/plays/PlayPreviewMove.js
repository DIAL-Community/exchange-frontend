import { useState } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import { HiExternalLink } from 'react-icons/hi'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { HtmlViewer } from '../shared/HtmlViewer'
import { MOVE_PREVIEW_QUERY } from '../../queries/play'

const PlayPreviewMove = ({ moveName, moveSlug, playSlug, pdf = false }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [openingDetail, setOpeningDetail] = useState(pdf)

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
    loadDetailData()
  }

  const { locale } = useRouter()

  const [loadDetailData, { data, called, loading }] = useLazyQuery(MOVE_PREVIEW_QUERY, {
    variables: { playSlug, slug: moveSlug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !moveSlug
  })

  return (
    <div className='flex flex-col border border-dial-orange-light'>
      <div className='move-header cursor-pointer' onClick={toggleDetail}>
        <div className='move-animation-base bg-dial-biscotti h-14' />
        <div
          className={classNames(
            'animated-move',
            openingDetail ? 'move-header-expanded' : 'move-header-collapsed',
            'move-animation bg-dial-orange-light h-14'
          )}
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
          { called && loading && format('general.loadingData') }
          { data &&
            <>
              <HtmlViewer
                initialContent={data.move?.moveDescription?.description}
                editorId={`move-${data.move?.id}-desc`}
              />
              {data?.move?.resources && data?.move?.resources.length > 0 &&
                <>
                  <div className='font-semibold py-2'>{format('move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.resources
                      .filter(resource => resource.url && resource.name)
                      .map(resource => {
                        return (
                          <a key={resource.i} href={resource.url} target='_blank' rel='noreferrer'>
                            <div
                              key={resource.i}
                              className={classNames(
                                'group border-2 border-gray-300 hover:border-dial-sunshine',
                                'card-drop-shadow'
                              )}
                            >
                              <div className='flex'>
                                <div className='flex flex-col gap-2 px-3 py-4'>
                                  <div className='font-semibold'>{resource.name}</div>
                                  <div className='text-sm'>{resource.description}</div>
                                </div>
                                <HiExternalLink className='ml-auto px-2' size='2.2em' />
                              </div>
                            </div>
                          </a>
                        )
                      })
                    }
                  </div>
                </>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default PlayPreviewMove
