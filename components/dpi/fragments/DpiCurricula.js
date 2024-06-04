import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PAGINATED_PLAYBOOKS_QUERY } from '../../shared/query/playbook'
import { CURRICULUM_PAGE_SIZE } from '../curriculum/constant'
import CurriculumPagination from '../curriculum/CurriculumPagination'
import { stripeClasses } from '../sections/DpiDashboard'

const CurriculumCard = ({ curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { playbookDescription: curriculumDescription } = curriculum

  const displayLargeCard = () =>
    <div className='px-4 py-6 rounded-lg min-h-[12rem]'>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {curriculum.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 bg-white border shrink-0 flex justify-center'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + curriculum.imageFile}
              alt={format('ui.image.logoAlt', { name: format('dpi.curriculum.label') })}
              className='object-contain w-16 h-16 mx-auto self-center'
            />
          </div>
        }
        {curriculum.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 bg-white rounded-full shrink-0 flex justify-center'>
            <img
              src='/ui/v1/playbook-header.svg'
              alt={format('ui.image.logoAlt', { name: format('dpi.curriculum.label') })}
              className='object-contain w-12 h-12 mx-auto self-center'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold'>
            {curriculum.name}
          </div>
          <div className='line-clamp-4'>
            {curriculumDescription && parse(curriculumDescription?.sanitizedOverview)}
          </div>
          <div className='flex gap-x-2'>
            <div className='text-sm'>
              {format('ui.tag.header')} ({curriculum.tags?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('dpi.curriculum.module.header')} ({curriculum.plays?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/dpi-curriculum/${curriculum.slug}`}>
        {displayLargeCard()}
      </Link>
    </div>
  )

}

const CurriculumList = ({ pageNumber }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PAGINATED_PLAYBOOKS_QUERY, {
    variables: {
      owner: 'dpi',
      limit: CURRICULUM_PAGE_SIZE,
      offset: pageNumber * CURRICULUM_PAGE_SIZE
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginatedPlaybooks) {
    return format('app.notFound')
  }

  const { paginatedPlaybooks: curriculumList } = data

  return (
    <div className='flex flex-col gap-2'>
      {curriculumList.map((curriculum, index) =>
        <div className='flex flex-col gap-y-4' key={index}>
          <hr className='border-b border-gray-300 border-dashed' />
          <CurriculumCard key={index} curriculum={curriculum} />
        </div>
      )}
    </div>
  )
}

const DpiCurricula = ({ stripeIndex }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }, [])

  return (
    <div className={`curriculum-section ${stripeClasses(stripeIndex)}`}>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='text-2xl pt-8 pb-2 '>
          {format('dpi.curriculum.title')}
        </div>
        <div className='text-sm pt-2 pb-4 max-w-prose'>
          {format('dpi.curriculum.subtitle')}
        </div>
        <CurriculumList pageNumber={pageNumber} />
        <CurriculumPagination
          pageNumber={pageNumber}
          onClickHandler={onClickHandler}
          theme={stripeIndex % 2 === 0 ? 'dark': 'light'}
        />
      </div>
    </div>
  )
}

export default DpiCurricula
