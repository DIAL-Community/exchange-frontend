import { getServerSideSitemap } from 'next-sitemap'
import { PLAYBOOK_SEARCH_QUERY } from '../../../components/shared/query/playbook'
import { initializeApollo } from '../../../lib/apolloClient'

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo({})

  const data = await client.query({
    query: PLAYBOOK_SEARCH_QUERY,
    variables: { search: '', owner: 'public' }
  })

  const fields = data.data.playbooks.map((playbook) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/playbooks/${playbook.slug}`,
    lastmod: new Date().toISOString()
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
