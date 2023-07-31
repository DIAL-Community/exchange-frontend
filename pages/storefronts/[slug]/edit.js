import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import { useOrganizationOwnerUser, useUser } from '../../../lib/hooks'
import StorefrontForm from '../../../components/organizations/storefronts/StorefrontForm'

const ORGANIZATION_QUERY = gql`
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      website
      imageFile
      aliases
      hasStorefront
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

  const { user, loadingUserSession } = useUser()
  const { isOrganizationOwner } = useOrganizationOwnerUser(data?.organization)

  const canEdit = user || isOrganizationOwner

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
              ? <StorefrontForm organization={data.organization} />
              : <Unauthorized />}
        </ClientOnly>
      )}
      <Footer />
    </>
  )
}

export default EditStorefront
