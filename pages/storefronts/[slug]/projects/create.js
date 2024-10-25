import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ProjectForm from '../../../../components/project/fragments/ProjectForm'
import Footer from '../../../../components/shared/Footer'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../../components/shared/GraphQueryHandler'
import Header from '../../../../components/shared/Header'
import { ORGANIZATION_DETAIL_QUERY } from '../../../../components/shared/query/organization'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import ClientOnly from '../../../../lib/ClientOnly'

const CreateProject = ({ defaultTenants }) => {
  const { locale, query } = useRouter()
  const { slug } = query

  const { loading, error, data } = useQuery(ORGANIZATION_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        'Accept-Language': locale,
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    },
    skip: !slug
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.storefront) {
    return handleMissingData()
  }

  return (
    <>
      <Header />
      <ClientOnly clientTenants={defaultTenants}>
        <ProjectForm storefront={data?.storefront} />
      </ClientOnly>
      <Footer />
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default CreateProject
