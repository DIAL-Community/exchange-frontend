import { getServerSideSitemap } from 'next-sitemap'
import client from '../../../lib/apolloClient'
import { PLAYBOOK_SEARCH_QUERY } from '../../../queries/playbook'

export const getServerSideProps = async (ctx) => {

  const data = await client.query({
    query: PLAYBOOK_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.playbooks.map((playbook) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/playbooks/${playbook.slug}`,
    lastmod: new Date().toISOString(),
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
