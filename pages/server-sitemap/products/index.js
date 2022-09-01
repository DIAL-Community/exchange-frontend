import { getServerSideSitemap } from 'next-sitemap'
import client from '../../../lib/apolloClient'
import { PRODUCT_SEARCH_QUERY } from '../../../queries/product'

export const getServerSideProps = async (ctx) => {

  const data = await client.query({
    query: PRODUCT_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.products.map((product) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/products/${product.slug}`,
    lastmod: new Date().toISOString(),
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
