import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error, Unauthorized } from '../../../components/shared/FetchStatus'
import ClientOnly from '../../../lib/ClientOnly'
import NotFound from '../../../components/shared/NotFound'
import OpportunityForm from '../../../components/opportunities/OpportunityForm'
import { useUser } from '../../../lib/hooks'

const OPPORTUNITY_QUERY = gql`
  query Opportunity($slug: String!) {
    opportunity(slug: $slug) {
      id
      name
      slug
      imageFile
      webAddress
      description
      opportunityStatus
      opportunityType
      closingDate
      openingDate
      contactName
      contactEmail
    }
  }
`

const EditOpportunity = () => {
  const router = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data, refetch } = useQuery(OPPORTUNITY_QUERY, {
    variables: { slug, locale },
    skip: !slug,
    context: { headers: { 'Accept-Language': locale } }
  })

  const { isAdminUser, loadingUserSession } = useUser()
  const canEdit = isAdminUser

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.opportunity) {
    return <NotFound />
  }

  return (
    <>
      <Header />
      {data && data.opportunity && (
        <ClientOnly>
          {loadingUserSession
            ? <Loading />
            : canEdit
              ? <OpportunityForm opportunity={data.opportunity} />
              : <Unauthorized />}
        </ClientOnly>
      )}
      <Footer />
    </>
  )
}

export default EditOpportunity
