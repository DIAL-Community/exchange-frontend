import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import OrganizationForm from '../../../components/organizations/OrganizationForm'
import { useOrganizationOwnerUser, useUser } from '../../../lib/hooks'

const ORGANIZATION_QUERY = gql`
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      isMni
      website
      imageFile
      isEndorser
      whenEndorsed
      endorserLevel
      aliases
      organizationDescription {
        description
        locale
      }
    }
  }
`

const EditStorefront = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(ORGANIZATION_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  const { isAdminUser, loadingUserSession } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(data?.organization)

  const canEdit = isAdminUser || isOrganizationOwner

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.organization) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      {data && data.organization && (
        <ClientOnly>
          {loadingUserSession
            ? <Loading />
            : canEdit
              ? <OrganizationForm organization={data.organization} />
              : <Unauthorized />}
        </ClientOnly>
      )}
      <Footer />
    </>
  )
}

export default EditStorefront
