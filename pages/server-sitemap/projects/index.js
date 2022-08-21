import { getServerSideSitemap } from 'next-sitemap'
import client from '../../../lib/apolloClient'
import { PROJECT_SEARCH_QUERY } from '../../../queries/project'

export const getServerSideProps = async (ctx) => {

  const data = await client.query({
    query: PROJECT_SEARCH_QUERY,
    variables: { search: '' }
  })

  const fields = data.data.projects.map((project) => ({
    loc: `${process.env.NEXT_PUBLIC_RAILS_SERVER}/projects/${project.slug}`,
    lastmod: new Date().toISOString(),
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {}
