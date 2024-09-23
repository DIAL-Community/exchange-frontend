import { useCallback } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { prependUrlWithProtocol } from '../../../utils/utilities'

const OrganizationDetailHeader = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-4 py-3'>
      <div className="flex justify-center items-center py-16 bg-white rounded border-health-red border-4">
        {organization.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className="inline">
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className="object-contain"
            />
          </div>
        }
        {organization.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className="w-20 h-20">
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.organization.label') })}
              className="object-contain dial-plum-filter"
            />
          </div>
        }
      </div>
      <div className="flex flex-col gap-y-8 text-sm pt-6 pb-3">
        <div className="flex flex-col gap-y-3">
          <div className="font-semibold text-black">
            {format('organization.website')}
          </div>
          <div className="flex text-dial-stratos">
            {organization.website ?
              <a
                href={prependUrlWithProtocol(organization.website)}
                target="_blank"
                rel="noreferrer"
                className="flex border-b border-dial-iris-blue ">
                <div className="line-clamp-1 break-all">
                  {organization.website}
                </div>
                &nbsp;⧉
              </a>
              : <span className="text-dial-stratos">{format('general.na').toUpperCase()}</span>
            }
          </div>
        </div>
        {organization.whenEndorsed &&
          <>
            <hr className="border-b border-dial-slate-200"/>
            <div className="flex flex-col gap-y-2 text-xs grow shrink-0">
              <div className="text-sm italic">
                {format('organization.isEndorser')}
              </div>
              <div className="flex gap-x-1 italic text-health-red">
                <span>{format('ui.organization.endorsedIn')}:</span>
                <FormattedDate value={organization.whenEndorsed}/>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default OrganizationDetailHeader
