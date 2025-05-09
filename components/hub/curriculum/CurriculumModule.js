import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FaCommentAlt } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa6'
import { FiEdit3, FiMove } from 'react-icons/fi'
import { HiExternalLink } from 'react-icons/hi'
import { useInView } from 'react-intersection-observer'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useUser } from '../../../lib/hooks'
import CreateButton from '../../shared/form/CreateButton'
import EditButton from '../../shared/form/EditButton'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { UPDATE_MOVE_DESCRIPTION } from '../../shared/mutation/move'
import { UPDATE_PLAY_DESCRIPTION } from '../../shared/mutation/play'
import { COMMENTS_COUNT_QUERY } from '../../shared/query/comment'
import { MOVE_PREVIEW_QUERY, PLAY_QUERY } from '../../shared/query/play'
import { ObjectType } from '../../utils/constants'
import { prependUrlWithProtocol } from '../../utils/utilities'
import { DPI_TENANT_NAME } from '../constants'
import { CurriculumContext } from './CurriculumContext'
import RearrangeSubModules from './forms/RearrangeSubModules'
import UnassignModule from './UnassignModule'
import UnassignSubModule from './UnassignSubModule'

const CurriculumSubmodule = ({ subModuleName, subModuleSlug, moduleSlug, curriculumSlug, expanded = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [openingDetail, setOpeningDetail] = useState(expanded)

  const { user } = useUser()
  const allowedToEdit = () => user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
    loadDetailData()
  }

  const { locale } = useRouter()

  const [loadDetailData, { data, called, loading }] = useLazyQuery(MOVE_PREVIEW_QUERY, {
    variables: { playSlug: moduleSlug, slug: subModuleSlug },
    context: { headers: { 'Accept-Language': locale } }
  })

  const generateEditLink = () => {
    return '' +
      `/hub/curriculum/${curriculumSlug}` +
      `/module/${moduleSlug}` +
      `/submodule/${subModuleSlug}` +
      '/edit'
  }

  const [ updateDescription ] = useMutation(UPDATE_MOVE_DESCRIPTION, {
    refetchQueries: [
      {
        query: PLAY_QUERY,
        variables: { playSlug: moduleSlug, playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME }
      }
    ]
  })

  const handleHtmlChanged = (html) => {
    updateDescription({
      variables: {
        slug: subModuleSlug,
        type: ObjectType.MOVE,
        owner: DPI_TENANT_NAME,
        parentSlug: moduleSlug,
        description: html
      }
    })
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
              {subModuleName}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
              {allowedToEdit() &&
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
              {allowedToEdit() &&
                <UnassignSubModule
                  curriculumSlug={curriculumSlug}
                  moduleSlug={moduleSlug}
                  subModuleSlug={subModuleSlug}
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
            <div>
              <HtmlViewer
                initialContent={data.move?.moveDescription?.description}
                handleHtmlChanged={handleHtmlChanged}
              />
              {data?.move?.resources && data?.move?.resources.length > 0 &&
                <div className='text-sm'>
                  <div className='font-semibold py-2'>{format('ui.move.resources.header')}</div>
                  <div className='flex flex-wrap gap-3'>
                    {data?.move?.resources
                      .filter(resource => resource.name && resource.slug)
                      .map(resource => (
                        <Link
                          key={resource.id}
                          href={`/hub/resources/${resource.slug}`}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <div className='group border border-gray-300 hover:border-dial-sunshine shadow-md'>
                            <div className='flex gap-3 px-3'>
                              <div className='flex flex-col gap-2 px-3 py-4'>
                                <div className='font-semibold'>{resource.name}</div>
                              </div>
                              <FaArrowRight className='my-auto shrink-0' />
                            </div>
                          </div>
                        </Link>
                      ))
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
                      .map(resource => (
                        <a
                          key={resource.i}
                          href={prependUrlWithProtocol(resource.url)}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <div className='group border border-gray-300 hover:border-dial-sunshine shadow-md'>
                            <div className='flex gap-3 px-3'>
                              <div className='flex flex-col gap-2 px-3 py-4'>
                                <div className='font-semibold'>
                                  {resource.name}
                                </div>
                                <div className='text-sm'>
                                  {resource.description}
                                </div>
                              </div>
                              <HiExternalLink className='my-auto shrink-0' />
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

const ModuleCommentCount = ({ curriculumSlug, module, locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(COMMENTS_COUNT_QUERY, {
    variables: { commentObjectType: ObjectType.PLAY, commentObjectId: parseInt(module.id) },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  return (
    <div className='text-sm flex gap-2'>
      {loading && 'Counting comments...'}
      {error && 'Error reading comments...'}
      {data &&
        <Link
          href={`${curriculumSlug}/module/${module.slug}`}
          className='px-3 rounded border border-dial-blueberry hover:bg-dial-blueberry hover:text-dial-cotton'
        >
          <div className='flex gap-2 py-1'>
            <FaCommentAlt className='my-auto' />
            {format('hub.curriculum.module.commentCount.title', { commentCount: data.countComments })}
          </div>
        </Link>
      }
    </div>
  )
}

const CurriculumModule = ({ index, moduleSlug, curriculumSlug, locale, moduleRefs }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data, loading, error } = useQuery(PLAY_QUERY, {
    variables: { playSlug: moduleSlug, playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  const [ updateDescription ] = useMutation(UPDATE_PLAY_DESCRIPTION, {
    refetchQueries: [
      {
        query: PLAY_QUERY,
        variables: { playSlug: moduleSlug, playbookSlug: curriculumSlug, owner: DPI_TENANT_NAME }
      }
    ]
  })

  const handleHtmlChanged = (html) => {
    updateDescription({
      variables: {
        slug: moduleSlug,
        type: ObjectType.PLAY,
        owner: DPI_TENANT_NAME,
        description: html
      }
    })
  }

  const { loadingUserSession, user } = useUser()
  const allowedToEdit = () => user?.isAdliAdminUser || user?.isAdminUser || user?.isEditorUser

  const { setModulePercentages } = useContext(CurriculumContext)
  const [displayRearrangeDialog, setDisplayRearrangeDialog] = useState(false)
  const onRearrangeDialogClose = () => {
    setDisplayRearrangeDialog(false)
  }

  const { ref } = useInView({
    threshold: [0.001, 0.2, 0.4, 0.6, 0.8, 0.999],
    onChange: (inView, entry) => {
      setModulePercentages(
        previousModulePercentage => ({
          ...previousModulePercentage,
          [moduleSlug]: entry.intersectionRatio
        })
      )
    }
  })

  const scrollRef = useRef(null)
  useEffect(() => {
    if (moduleRefs.current) {
      moduleRefs.current[moduleSlug] = scrollRef
    }
  }, [scrollRef, moduleRefs, moduleSlug])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.play) {
    return handleMissingData()
  }

  const { play: module } = data
  const { playMoves: subModules } = module

  const generateEditLink = () => {
    return `/hub/curriculum/${curriculumSlug}/module/${moduleSlug}/edit`
  }

  const generateAddSubModuleLink = () => {
    return `/hub/curriculum/${curriculumSlug}/module/${moduleSlug}/submodule/create`
  }

  return (
    <div className='my-3 intersection-observer' ref={ref}>
      {loadingUserSession
        ? <div className='absolute top-2 right-2'>{format('general.loadingData')}</div>
        : (
          <div className='flex flex-col gap-3 sticky-scroll-offset' ref={scrollRef}>
            <div className='flex flex-wrap gap-3'>
              <Link href={`/hub/curriculum/${curriculumSlug}/module/${module.slug}`}>
                <div className={`font-semibold text-2xl flex gap-2 ${module.draft && 'text-dial-sapphire'}`}>
                  {!isNaN(index) && `${format('hub.curriculum.module.label')} ${index + 1}. ${module.name}`}
                  {isNaN(index) && `${module.name}`}
                  {module.draft &&
                    <span className='font-bold'>
                      ({format('ui.play.status.draft')})
                    </span>
                  }
                </div>
              </Link>
              <div className='ml-auto my-auto flex gap-2'>
                {allowedToEdit() && <EditButton type='link' href={generateEditLink()} />}
                {allowedToEdit() && <UnassignModule curriculumSlug={curriculumSlug} moduleSlug={moduleSlug} />}
              </div>
            </div>
            {!isNaN(index) &&
              <ModuleCommentCount
                curriculumSlug={curriculumSlug}
                module={module}
                locale={locale}
              />
            }
            <HtmlViewer
              initialContent={module?.playDescription?.description}
              handleHtmlChanged={handleHtmlChanged}
            />
            <div className='flex gap-2 ml-auto'>
              {allowedToEdit() &&
                <CreateButton
                  type='link'
                  label={format('hub.curriculum.submodule.add')}
                  href={generateAddSubModuleLink()}
                />
              }
              {allowedToEdit() && subModules.length > 0 &&
                <button
                  type='button'
                  onClick={() => setDisplayRearrangeDialog(!displayRearrangeDialog)}
                  className='cursor-pointer bg-dial-iris-blue px-2 py-0.5 rounded text-dial-cotton'
                >
                  <FiMove className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    {format('hub.curriculum.submodule.rearrange')}
                  </span>
                </button>
              }
            </div>
            {subModules.map((subModule, index) =>
              <CurriculumSubmodule
                key={index}
                moduleSlug={moduleSlug}
                subModuleName={subModule.name}
                subModuleSlug={subModule.slug}
                curriculumSlug={curriculumSlug}
              />
            )}
            <RearrangeSubModules
              onRearrangeDialogClose={onRearrangeDialogClose}
              displayRearrangeDialog={displayRearrangeDialog}
              module={module}
            />
          </div>
        )}
    </div>
  )
}

export default CurriculumModule
