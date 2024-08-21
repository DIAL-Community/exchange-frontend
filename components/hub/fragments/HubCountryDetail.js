import { useState } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedMessage } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import CountryForm from '../country/CountryForm'
import HubCountryPolicies from './HubCountryPolicies'
import HubCountryProducts from './HubCountryProducts'
import HubCountryResources from './HubCountryResources'
import HubCountryWebsites from './HubCountryWebsites'

const HubCountryDetail = ({ country }) => {
  const [editing, setEditing] = useState(false)

  const { user } = useUser()

  return (
    <div className='flex flex-col'>
      {!editing &&
        <div className='description-section pb-4'>
          <div className='px-4 lg:px-8 xl:px-56 text-dial-stratos flex flex-col'>
            <div className='flex flex-flex-wrap gap-3'>
              <div className='text-xl font-medium py-6 '>
                <FormattedMessage id='ui.country.overview' />
              </div>
              {(user?.isAdminUser || user?.isEditorUser) &&
                <button onClick={() => setEditing(true)} className='ml-auto text-dial-sapphire'>
                  <FiEdit3 className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    <FormattedMessage id='app.edit' />
                  </span>
                </button>
              }
            </div>
            { country?.description && <HtmlViewer initialContent={country?.description} />}
            { !country?.description &&
              <div className='pb-6 text-dial-stratos'>
                <FormattedMessage id='ui.country.descriptionNotAvailable' />
              </div>}
          </div>
        </div>
      }
      { editing &&
          <div className='px-4 lg:px-8 xl:px-56 text-dial-cotton flex flex-col'>
            <CountryForm country={country} setEditing={setEditing} />
          </div>
      }
      <HubCountryPolicies country={country} />
      <HubCountryWebsites country={country} />
      <HubCountryProducts country={country} />
      <HubCountryResources country={country} />
    </div>
  )
}

export default HubCountryDetail
