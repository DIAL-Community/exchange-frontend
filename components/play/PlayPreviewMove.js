import { useCallback, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FaArrowRight } from 'react-icons/fa6'
import { FiEdit3 } from 'react-icons/fi'
import { HiExternalLink } from 'react-icons/hi'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'
import { useUser } from '../../lib/hooks'
import UnassignMove from '../move/UnassignMove'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { MOVE_PREVIEW_QUERY } from '../shared/query/move'
import { prependUrlWithProtocol } from '../utils/utilities'

const PlayPreviewMove = ({ moveName, moveSlug, playSlug, playbookSlug, pdf = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [openingDetail, setOpeningDetail] = useState(pdf)

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
    loadDetailData()
  }

  const { locale } = useRouter()

  const { user } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  const [loadDetailData, { data, called, loading }] = useLazyQuery(MOVE_PREVIEW_QUERY, {
    variables: { playSlug, slug: moveSlug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !moveSlug
  })

  const generateEditLink = () => {
    if (!user) {
      return '/edit-not-available'
    }

    return `/${locale}/playbooks/${playbookSlug}/plays/${playSlug}/moves/${moveSlug}/edit`
  }

  return (
    <div className='flex flex-col border border-dial-orange-light'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div
          className={classNames(
            'animated-collapse',
            openingDetail ? 'header-expanded' : 'header-collapsed',
            'collapse-animation bg-dial-orange-light h-14'
          )}
        />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleDetail}>
            <div className='font-semibold px-4 py-4'>
              {moveName}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
              {canEdit &&
                <a
                  href={generateEditLink()}
                  className='cursor-pointer bg-white px-2 py-0.5 rounded'
                >
                  <FiEdit3 className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    <FormattedMessage id='app.edit' />
                  </span>
                </a>
              }
              {canEdit &&
                <UnassignMove
                  playbookSlug={playbookSlug}
                  playSlug={playSlug}
                  moveSlug={moveSlug}
                />
              }
              <button
                type='button'
                onClick={toggleDetail}
                className='cursor-pointer bg-white px-2 py-1.5 rounded'
              >
                {openingDetail
                  ? <BsChevronUp className='cursor-pointer p-01 text-dial-stratos'/>
                  : <BsChevronDown className='cursor-pointer p-0.5 text-dial-stratos'/>
                }
              </button>
            </div>
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
                <div className='text-sm'>
                  <div className='font-semibold py-2'>{format('ui.move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.resources
                      .filter(resource => resource.resourceLink && resource.name)
                      .map(resource => {
                        return (
                          <Link
                            key={resource.id}
                            href={`/resources/${resource.slug}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <div className='group border border-gray-300 hover:border-dial-sunshine shadow-md'>
                              <div className='flex gap-3 px-3'>
                                <div className='flex flex-col gap-2 px-3 py-4'>
                                  <div className='font-semibold'>{resource.name}</div>
                                </div>
                                <FaArrowRight className='my-auto' />
                              </div>
                            </div>
                          </Link>
                        )
                      })
                    }
                  </div>
                </div>
              }
              {data?.move?.inlineResources && data?.move?.inlineResources.length > 0 &&
                <div className='text-sm'>
                  <div className='font-semibold py-2'>{format('ui.move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.inlineResources
                      .filter(resource => resource.url && resource.name)
                      .map(resource => {
                        return (
                          <a
                            key={resource.i}
                            href={prependUrlWithProtocol(resource.url)}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <div className='group border border-gray-300 hover:border-dial-sunshine shadow-md'>
                              <div className='flex gap-3 px-3'>
                                <div className='flex flex-col gap-2 px-3 py-4'>
                                  <div className='font-semibold'>{resource.name}</div>
                                  <div className='text-sm'>{resource.description}</div>
                                </div>
                                <HiExternalLink className='my-auto' />
                              </div>
                            </div>
                          </a>
                        )
                      })
                    }
                  </div>
                </div>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default PlayPreviewMove
