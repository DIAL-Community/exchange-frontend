import { gql, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useOrganizationOwnerUser, useProductOwnerUser, useUser } from '../../lib/hooks'
import { Error, Loading } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import ProjectDetailLeft from './ProjectDetailLeft'
import ProjectDetailRight from './ProjectDetailRight'

const PROJECT_QUERY = gql`
  query Project($slug: String!) {
    project(slug: $slug) {
      id
      name
      slug
      tags
      projectUrl
      projectDescription {
        description
        locale
      }
      organizations {
        id
        slug
        name
        website
        whenEndorsed
        imageFile
      }
      products {
        id
        slug
        name
        imageFile
      }
      sectors {
        name
        slug
      }
      countries {
        name
        slug
      }
      origin {
        slug
        name
      }
    }
  }
`

const ProjectDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(PROJECT_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const [session] = useSession()
  const { isAdminUser } = useUser(session)
  const { ownsSomeOrganization } = useOrganizationOwnerUser(session, null, data?.project?.organizations)
  const { ownsSomeProduct } = useProductOwnerUser(null, data?.project?.products, isAdminUser)
  
  const canEdit = isAdminUser || ownsSomeOrganization || ownsSomeProduct 

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.project &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ProjectDetailLeft project={data.project} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <ProjectDetailRight project={data.project} canEdit={canEdit} />
            </div>
          </div>
      }
    </>
  )
}

export default ProjectDetail
