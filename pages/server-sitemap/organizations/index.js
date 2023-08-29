import { getServerSideSitemap } from 'next-sitemap'
import { initializeApollo } from '../../../lib/apolloClient'
import { ORGANIZATION_SEARCH_QUERY } from '../../../queries/organization'

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo({})

  const data = await client.query({
    query: ORGANIZATION_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.organizations.map((organization) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/organizations/${organization.slug}`,
    lastmod: new Date().toISOString()
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
