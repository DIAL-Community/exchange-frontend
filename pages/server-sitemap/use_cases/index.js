import { getServerSideSitemap } from 'next-sitemap'
import { initializeApollo } from '../../../lib/apolloClient'
import { USE_CASE_SEARCH_QUERY } from '../../../queries/use-case'

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo({})

  const data = await client.query({
    query: USE_CASE_SEARCH_QUERY,
    variables: { search: '', mature: false }
  })

  const fields = data.data.useCases.map((useCase) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/use_cases/${useCase.slug}`,
    lastmod: new Date().toISOString()
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
