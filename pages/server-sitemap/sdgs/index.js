import { getServerSideSitemap } from 'next-sitemap'
import { initializeApollo } from '../../../lib/apolloClient'
import { SDG_SEARCH_QUERY } from '../../../queries/sdg'

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo({})

  const data = await client.query({
    query: SDG_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.sdgs.map((sdg) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/sdgs/${sdg.slug}`,
    lastmod: new Date().toISOString(),
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
