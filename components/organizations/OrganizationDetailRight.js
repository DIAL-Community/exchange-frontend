import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import SectorCard from '../sectors/SectorCard'
import CountryCard from '../countries/CountryCard'
import ProjectCard from '../projects/ProjectCard'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'

const DynamicOfficeMarker = (props) => {
  const OfficeMarker = useMemo(() => dynamic(
    () => import('./OfficeMarker'),
    {
      loading: () => <div>Loading Map data ...</div>,
      ssr: false
    }
  ), [props])
  return <OfficeMarker {...props} />
}

const OrganizationDetailRight = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const marker = organization.offices.length > 0
    ? {
        position: [parseFloat(organization.offices[0].latitude), parseFloat(organization.offices[0].longitude)],
        title: organization.name,
        body: organization.offices[0].name
      }
    : undefined

  return (
    <div className=''>
      <Breadcrumb />
      <div className='flex flex-col lg:flex-row flex-wrap'>
        <div className='flex flex-col flex-grow pb-4'>
          <div className='text-sm text-dial-purple-light leading-6 tracking-wide'>
            {format('organization.detail.website').toUpperCase()}
          </div>
          <div className='text-base text-dial-teal'>
            <a href={`//${organization.website}`} className='flex flex-row' target='_blank' rel='noreferrer'>
              <div className='my-auto'>{organization.website} ⧉</div>
            </a>
          </div>
          {
            organization.whenEndorsed &&
              <>
                <div className='text-sm leading-6 text-dial-purple-light pt-6 leading-6 tracking-wide'>
                  {format('organization.detail.whenEndorsed').toUpperCase()}
                </div>
                <div className='text-base text-dial-teal pb-2'>
                  <FormattedDate value={new Date(organization.whenEndorsed)} year="numeric" month="long" day="2-digit" />
                </div>
              </>
          }
        </div>
        {
          marker &&
            <DynamicOfficeMarker {...marker} />
        }
      </div>
      {
        organization.sectors &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('sector.header')}</div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              {organization.sectors.map((sector, i) => <SectorCard key={i} sector={sector} listType='list' />)}
            </div>
          </div>
      }
      {
        organization.countries &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('country.header')}</div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              {organization.countries.map((country, i) => <CountryCard key={i} country={country} listType='list' />)}
            </div>
          </div>
      }
      {
        organization.projects && organization.projects.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3'>{format('project.header')}</div>
            <div className='grid grid-cols-1'>
              {organization.projects.map((project, i) => <ProjectCard key={i} project={project} listType='list' />)}
            </div>
          </div>
      }
    </div>
  )
}

export default OrganizationDetailRight
