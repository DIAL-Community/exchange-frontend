import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { ORGANIZATION_DETAIL_QUERY } from '../../../../components/shared/query/organization'
import { Error, Loading, NotFound } from '../../../../components/shared/FetchStatus'
import Header from '../../../../components/shared/Header'
import ClientOnly from '../../../../lib/ClientOnly'
import Footer from '../../../../components/shared/Footer'
import ProjectForm from '../../../../components/project/fragments/ProjectForm'

const CreateProject = ({ defaultTenants }) => {
  const { locale, query } = useRouter()
  const { slug } = query

  const { loading, error, data } = useQuery(ORGANIZATION_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.storefront) {
    return <NotFound />
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
