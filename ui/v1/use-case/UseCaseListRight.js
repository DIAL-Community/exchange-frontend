import { useQuery } from '@apollo/client'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { Error, Loading } from '../../../components/shared/FetchStatus'
import { UseCaseFilterContext } from '../../../components/context/UseCaseFilterContext'
import { PAGINATED_USE_CASES_QUERY } from '../shared/queries/useCase'

const UseCaseListRight = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const DEFAULT_PAGE_SIZE = 2

  const { sdgs, showBeta, govStackOnly, search } = useContext(UseCaseFilterContext)

  const { loading, error, data, fetchMore } = useQuery(PAGINATED_USE_CASES_QUERY, {
    variables: {
      search,
      sdgs: sdgs.map(sdg => sdg.value),
      showBeta,
      govStackOnly,
      limit: DEFAULT_PAGE_SIZE,
      offset: pageOffset
    }
  })

  useEffect(() => {
    fetchMore({
      variables: {
        search,
        sdgs: sdgs.map(sdg => sdg.value),
        showBeta,
        govStackOnly,
        limit: DEFAULT_PAGE_SIZE,
        offset: pageOffset
      }
    })
  }, [search, sdgs, showBeta, govStackOnly, pageOffset, fetchMore])

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  }

  const { paginatedUseCases: { useCases, paginationAttributes } } = data

  return (
    <>
      <div className='py-8'>
        Filtering part
      </div>
      <div className='flex flex-col gap-3'>
        {useCases.map((useCase, index) => (
          <div key={index} className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
            <div className='flex flex-row gap-x-6'>
              <img
                src='/ui/v1/use-case-header.svg'
                alt={format('ui.image.logoAlt', { name: 'Use Cases' })}
                width={70}
                height={70}
                className='object-contain'
              />
              <div className='flex flex-col gap-y-3'>
                <div className='text-lg font-semibold'>
                  {useCase.name}
                </div>
                {/*
                <HtmlViewer
                  initialContent={useCase?.useCaseDescription?.description}
                  editorId={`${index}-use-case-detail`}
                  className='-mb-12'
                />
                */}
                <div className='flex gap-x-2'>
                  <div className='text-sm'>
                    {format('ui.sdgTarget.header')} ({useCase.sdgTargets?.length ?? 0})
                  </div>
                  <div className='border border-r border-dial-slate-300' />
                  <div className='text-sm'>
                    {format('ui.buildingBlock.header')} ({useCase.buildingBlocks?.length ?? 0})
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-col gap-y-4 my-6'>
        <hr className='bg-dial-slate-300'/>
        <div className='flex flex-row gap-x-16'>
          <div className='my-auto text-sm font-semibold'>
            {format('ui.pagination.showingLabel', {
              firstRecord: pageNumber * DEFAULT_PAGE_SIZE + 1,
              lastRecord: (pageNumber + 1) * DEFAULT_PAGE_SIZE,
              totalRecords: paginationAttributes.totalCount
            })}
          </div>
          <ReactPaginate
            breakLabel='...'
            nextLabel={format('ui.pagination.nextLabel')}
            previousLabel={format('ui.pagination.prevLabel')}
            forcePage={pageNumber}
            onPageChange={handlePageClick}
            pageRangeDisplayed={DEFAULT_PAGE_SIZE}
            pageCount={Math.ceil(paginationAttributes.totalCount / DEFAULT_PAGE_SIZE)}
            renderOnZeroPageCount={null}
            // Flex the main container and add gap
            containerClassName='flex gap-x-3 text-sm font-semibold'
            // Each will have rounded border
            pageClassName='border border-dial-slate-300 rounded-md'
            activeClassName='border border-dial-iris-blue'
            // Set the width, height, leading and text center to center text
            pageLinkClassName='block w-10 h-10 leading-10 text-center'
            // Previous and next link will have similar treatment
            previousClassName='border border-dial-slate-300 rounded-md'
            previousLinkClassName='block w-10 h-10 leading-10 text-center'
            nextClassName='border border-dial-slate-300 rounded-md'
            nextLinkClassName='block w-10 h-10 leading-10 text-center'
          />
        </div>
        <hr className='bg-dial-slate-300'/>
      </div>
    </>
  )
}

export default UseCaseListRight
