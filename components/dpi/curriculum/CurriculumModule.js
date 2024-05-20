import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { HiExternalLink } from 'react-icons/hi'
import { useInView } from 'react-intersection-observer'
import { useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { MOVE_PREVIEW_QUERY, PLAY_QUERY } from '../../shared/query/play'
import { prependUrlWithProtocol } from '../../utils/utilities'

const CurriculumSubmodule = ({ subModuleName, subModuleSlug, moduleSlug, expanded = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [openingDetail, setOpeningDetail] = useState(expanded)

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
    loadDetailData()
  }

  const { locale } = useRouter()

  const [loadDetailData, { data, called, loading }] = useLazyQuery(MOVE_PREVIEW_QUERY, {
    variables: { playSlug: moduleSlug, slug: subModuleSlug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !subModuleSlug
  })

  return (
    <div className='flex flex-col border border-dial-orange-light'>
      <div className='move-header'>
        <div className='move-animation-base bg-dial-blue-chalk h-14' />
        <div
          className={classNames(
            'animated-move',
            openingDetail ? 'move-header-expanded' : 'move-header-collapsed',
            'move-animation bg-dial-orange-light h-14'
          )}
        />
        <div className='flex flex-row flex-wrap gap-3 move-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleDetail}>
            <div className='font-semibold px-4 py-4'>
              {subModuleName}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
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
            <div>
              <HtmlViewer initialContent={data.move?.moveDescription?.description} />
              {data?.move?.resources && data?.move?.resources.length > 0 &&
                <div>
                  <div className='font-semibold py-2'>{format('ui.move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.resources
                      .filter(resource => resource.url && resource.name)
                      .map(resource => (
                        <a
                          key={resource.i}
                          href={prependUrlWithProtocol(resource.url)}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <div
                            key={resource.i}
                            className={classNames(
                              'group border-2 border-gray-300 hover:border-dial-sunshine',
                              'shadow-md'
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
                      ))
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

const CurriculumModule = ({ index, moduleSlug, curriculumSlug, locale, moduleRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(PLAY_QUERY, {
    variables: { playSlug: moduleSlug, playbookSlug: curriculumSlug  },
    context: { headers: { 'Accept-Language': locale } }
  })

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      console.log('Is in view? inView=', inView, ', slug=', moduleSlug)
    }
  })

  const scrollRef = useRef(null)
  useEffect(() => {
    if (moduleRefs.current) {
      moduleRefs.current[moduleSlug] = scrollRef
    }
  }, [scrollRef, moduleRefs, moduleSlug])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.play) {
    return <NotFound />
  }

  const { play: module } = data
  const { playMoves: subModules } = module

  return (
    <div className='my-3 intersection-observer' ref={ref}>
      <div className='flex flex-col gap-3' ref={scrollRef}>
        <div className='font-semibold text-2xl'>
          {`${format('dpi.curriculum.module')} ${index + 1}. ${module.name}`}
        </div>
        <HtmlViewer initialContent={module?.playDescription?.description} />
        {subModules.map((subModule, index) =>
          <CurriculumSubmodule
            key={index}
            moduleSlug={moduleSlug}
            subModuleName={subModule.name}
            subModuleSlug={subModule.slug}
          />
        )}
      </div>
    </div>
  )
}

export default CurriculumModule
