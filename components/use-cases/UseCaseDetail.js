import { useQuery } from '@apollo/client'
import { useRef } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { useUser } from '../../lib/hooks'
import { USE_CASE_DETAIL_QUERY } from '../../queries/use-case'
import UseCaseDetailLeft from './UseCaseDetailLeft'
import UseCaseDetailRight from './UseCaseDetailRight'

const UseCaseDetail = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(USE_CASE_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const { isAdminUser: canEdit } = useUser()

  const commentsSectionElement = useRef()

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.useCase &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <UseCaseDetailLeft
                useCase={data.useCase}
                canEdit={canEdit}
                commentsSectionRef={commentsSectionElement}
              />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <UseCaseDetailRight
                useCase={data.useCase}
                canEdit={canEdit}
                commentsSectionRef={commentsSectionElement}
              />
            </div>
          </div>
      }
    </>
  )
}

export default UseCaseDetail
