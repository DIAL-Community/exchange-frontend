import { useIntl } from 'react-intl'
import { useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useUser } from '../../lib/hooks'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import DeleteCountry from './DeleteCountry'
import CountryForm from './CountryForm'

const DynamicCountryMarker = (props) => {
  const MapMarker = useMemo(() => dynamic(
    () => import('../shared/MapMarker'),
    {
      loading: () => <div>Loading Map data ...</div>,
      ssr: false
    }
  ), [])

  return <MapMarker {...props} />
}

const CountryDetail = ({ country }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser } = useUser()

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const toggleFormDialog = () => setIsFormDialogOpen(!isFormDialogOpen)

  const marker = {
    position: [parseFloat(country.latitude), parseFloat(country.longitude)],
    title: country.name,
    body: `${format('country.map.latLongDesc')} ${country.latitude}, ${country.longitude}.`,
    markerImage: '/icons/map/map.png',
    markerImageAltText: format('image.alt.logoFor', { name: format('country.header') }),
    initialZoom: 6
  }

  const slugNameMapping = useMemo(() => ({ [country.slug]: country.name }), [country])

  return (
    <div className='flex flex-col lg:flex-row pb-8'>
      <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
        <div className='block lg:hidden'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='pb-4'>
          {isAdminUser &&
            <div className='flex flex-row gap-3'>
              <DeleteCountry country={country} />
              <EditButton onClick={toggleFormDialog} />
            </div>
          }
        </div>
        <div className='bg-white border-2 border-dial-gray lg:mr-6 shadow-lg'>
          <div className='flex flex-col p-4'>
            <div className='font-semibold text-lg text-dial-gray-dark'>
              {country.name}
            </div>
            <div className='border-b my-2' />
            <div className='text-sm text-dial-gray-dark'>
              <span className='font-semibold'>{format('country.code')}</span>: {country.code}
            </div>
            <div className='text-sm text-dial-gray-dark'>
              <span className='font-semibold'>{format('country.codeLonger')}</span>: {country.codeLonger}
            </div>
          </div>
        </div>
      </div>
      <div className='px-4 w-full lg:w-2/3 xl:w-3/4 flex flex-col'>
        <div className='hidden lg:block'>
          <Breadcrumb slugNameMapping={slugNameMapping} />
        </div>
        <div className='flex flex-col lg:flex-row gap-3'>
          { country.latitude && country.longitude && <DynamicCountryMarker {...marker} /> }
        </div>
      </div>
      <CountryForm country={country} isOpen={isFormDialogOpen} onClose={toggleFormDialog} />
    </div>
  )
}

export default CountryDetail
