import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PAGINATED_PLAYBOOKS_QUERY } from '../../shared/query/playbook'
import DpiPagination from './DpiPagination'

const DEFAULT_PAGE_SIZE = 6

const CurriculumCard = ({ index, curriculum }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { playbookDescription: curriculumDescription } = curriculum

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
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
          <div className='text-lg font-semibold text-white'>
            {curriculum.name}
          </div>
          <div className='line-clamp-4 text-dial-cotton'>
            {curriculumDescription && parse(curriculumDescription?.sanitizedOverview)}
          </div>
          <div className='flex gap-x-2 text-dial-cotton'>
            <div className='text-sm'>
              {format('ui.tag.header')} ({curriculum.tags?.length ?? 0})
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

const DpiCurricula = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)
  const [curricula, setCurricula] = useState([])
  const [displayedCurricula, setDisplayedCurricula] = useState([])

  useQuery(PAGINATED_PLAYBOOKS_QUERY, {
    variables: { owner: 'dpi', limit: 100, offset: 0 },
    onCompleted: (data) => {
      const { paginatedPlaybooks: curricula } = data
      setCurricula(curricula)
      setDisplayedCurricula(curricula.slice(0, DEFAULT_PAGE_SIZE))
    }
  })

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
    setDisplayedCurricula(
      curricula.slice(
        destinationPage * DEFAULT_PAGE_SIZE,
        (destinationPage + 1) * DEFAULT_PAGE_SIZE
      )
    )
  }, [curricula])

  return (
    <div className='product-section bg-dial-sapphire'>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='text-2xl text-center py-8 text-white'>
          {format('dpi.curriculum.header')}
        </div>
        <div className='flex flex-col gap-8'>
          {displayedCurricula.map((curriculum, index) =>
            <CurriculumCard key={index} curriculum={curriculum} />
          )}
        </div>
        <DpiPagination
          pageNumber={pageNumber}
          totalCount={curricula.length}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
          theme='light'
        />
      </div>
    </div>
  )
}

export default DpiCurricula
