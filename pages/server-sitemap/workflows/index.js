import { getServerSideSitemap } from 'next-sitemap'
import { initializeApollo } from '../../../lib/apolloClient'
import { WORKFLOW_SEARCH_QUERY } from '../../../ui/v1/shared/query/workflow'

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo({})

  const data = await client.query({
    query: WORKFLOW_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.workflows.map((workflow) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/workflows/${workflow.slug}`,
    lastmod: new Date().toISOString()
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
