import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../GraphQueryHandler'
import { ORGANIZATION_WIDGET_QUERY } from '../../query/widget'

const PinnedOrganization = ({ disabled, slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(ORGANIZATION_WIDGET_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.organization) {
    return handleMissingData()
  }

  const { organization } = data

  return (
    <Link
      href={`/organizations/${organization.slug}`}
      className='h-full'
      onClick={(e) => { if (disabled) e.preventDefault() }}
    >
      <div className='cursor-pointer hover:rounded-lg hover:shadow-lg h-full'>
        <div className='bg-white border shadow-lg rounded-lg h-full'>
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-warm-beech',
                'py-12 mx-4 my-4'
              )}
          >
            {organization.imageFile.indexOf('placeholder.svg') < 0 &&
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className="w-auto h-16 object-contain"
              />
            }
            {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
                className="w-auto h-16 object-contain"
              />
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {organization.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {organization.parsedDescription && parse(organization.parsedDescription)}
            </span>
          </div>
          {organization.category &&
            <div className="flex items-center justify-center text-xs font-medium">
              <div className="rounded-full bg-dial-orange uppercase px-6 py-1 text-white">
                {organization.category}
              </div>
            </div>
          }
        </div>
      </div>
    </Link>
  )
}

export default PinnedOrganization
