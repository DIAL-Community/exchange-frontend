import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ProjectCard from '../../projects/ProjectCard'
import { Loading, Error } from '../../shared/FetchStatus'
import { WIZARD_PAGINATED_PROJECTS } from '../../../queries/wizard'

const DEFAULT_PAGE_SIZE = 5

const PagedProjectList = ({ countries, sectors, tags, projectSortHint }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [itemOffset, setItemOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(WIZARD_PAGINATED_PROJECTS, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      offset: itemOffset,
      countries,
      sectors,
      tags,
      projectSortHint
    }
  })

  useEffect(() => {
    if (itemOffset) {
      fetchMore({
        variables: {
          first: DEFAULT_PAGE_SIZE,
          offset: itemOffset,
          countries,
          sectors,
          tags,
          projectSortHint
        }
      })
    }
  }, [itemOffset])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    setItemOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <div className='pb-4 text-sm'>
        {data.paginatedProjects.nodes && data.paginatedProjects.nodes.length
          ? format('wizard.results.similarProjectsDesc')
          : format('wizard.results.noProjects')}
      </div>
      {
        data.paginatedProjects.nodes && data.paginatedProjects.nodes.map((project) => {
          return (<ProjectCard key={project.id} project={project} listType='list' newTab />)
        })
      }
      <ReactPaginate
        breakLabel='...'
        nextLabel={format('paginatedSection.page.next.label')}
        forcePage={currentPage}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil((itemOffset + data.paginatedProjects.totalCount) / DEFAULT_PAGE_SIZE)}
        previousLabel={format('paginatedSection.page.previous.label')}
        renderOnZeroPageCount={null}
        breakLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        containerClassName='flex mb-3 mt-3 ml-auto border-3 border-transparent'
        pageLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        activeLinkClassName='bg-dial-yellow border-dial-yellow'
        previousLinkClassName='relative block py-1.5 px-3 border border-dial-gray'
        nextLinkClassName='relative block py-1.5 px-3 border border-dial-gray -ml-px'
        disabledLinkClassName='text-dial-gray'
      />
    </>
  )
}

export default PagedProjectList
