import { getServerSideSitemap } from 'next-sitemap'
import { initializeApollo } from '../../../lib/apolloClient'
import { BUILDING_BLOCK_SEARCH_QUERY } from '../../../queries/building-block'

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo({})

  const data = await client.query({
    query: BUILDING_BLOCK_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.buildingBlocks.map((buildingBlock) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/building_blocks/${buildingBlock.slug}`,
    lastmod: new Date().toISOString()
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
