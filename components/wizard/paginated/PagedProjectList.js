import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useIntl } from 'react-intl'

import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import ProjectCard from '../../projects/ProjectCard'
import { Loading, Error } from '../../shared/FetchStatus'

const DEFAULT_PAGE_SIZE = 5
const PRODUCTS_QUERY = gql`
  query PaginatedProjects(
    $first: Int,
    $offset: Int,
    $sectors: [String!],
    $subSectors: [String!],
    $countries: [String!],
    $tags: [String!],
    $projectSortHint: String!
  ) {
    paginatedProjects(
      first: $first,
      offsetAttributes: { offset: $offset},
      sectors: $sectors,
      subSectors: $subSectors,
      countries: $countries,
      tags: $tags,
      projectSortHint: $projectSortHint
    ) {
      __typename
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        name
        slug
        organizations {
          id
          slug
          name
          imageFile
        }
        products {
          id
          slug
          name
          imageFile
        }
        origin {
          slug
          name
        }
      }
    }
  }
`

const PagedProjectList = ({ countries, sectors, subSectors, tags, projectSortHint }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const [itemOffset, setItemOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      offset: itemOffset,
      countries: countries,
      sectors: sectors,
      subSectors: subSectors,
      tags: tags,
      projectSortHint: projectSortHint
    }
  })

  useEffect(() => {
    console.log(`Loading items from ${itemOffset}`)
    if (itemOffset) {
      fetchMore({
        variables: {
          first: DEFAULT_PAGE_SIZE,
          offset: itemOffset,
          countries: countries,
          sectors: sectors,
          subSectors: subSectors,
          tags: tags,
          projectSortHint: projectSortHint
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
        {data.paginatedProjects.nodes && data.paginatedProjects.nodes.length ? format('wizard.results.similarProjectsDesc') : format('wizard.results.noProjects')}
      </div>
      {
        data.paginatedProjects.nodes && data.paginatedProjects.nodes.map((project) => {
          return (<ProjectCard key={project.name} project={project} listType='list' newTab />)
        })
      }
      <ReactPaginate
        breakLabel='...'
        nextLabel='Next >'
        forcePage={currentPage}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil((itemOffset + data.paginatedProjects.totalCount) / DEFAULT_PAGE_SIZE)}
        previousLabel='< Previous'
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
