import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import SectorCard from '../sectors/SectorCard'
import CountryCard from '../countries/CountryCard'
import ProjectCard from '../projects/ProjectCard'
import ProductCard from '../products/ProductCard'

import ReactHtmlParser from 'react-html-parser'
import { descriptionByLocale } from '../../lib/utilities'

import { useMemo } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import CityCard from '../cities/CityCard'
import AggregatorCapability from './AggregatorCapability'

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
  const format = (id, values) => formatMessage({ id: id }, values)

  const { locale } = useRouter()

  const marker = organization.offices.length > 0
    ? {
        position: [parseFloat(organization.offices[0].latitude), parseFloat(organization.offices[0].longitude)],
        title: organization.name,
        body: organization.offices[0].name
      }
    : undefined

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name
    return map
  })()

  return (
    <div className='px-4'>
      <div className='hidden lg:block'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
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
                  <FormattedDate value={new Date(organization.whenEndorsed)} year='numeric' month='long' day='2-digit' />
                </div>
              </>
          }
          {
            organization.endorserLevel && organization.endorserLevel !== 'none' &&
              <>
                <div className='text-sm leading-6 text-dial-purple-light pt-6 leading-6 tracking-wide'>
                  {format('organization.detail.endorserLevel').toUpperCase()}
                </div>
                <div className='text-base text-dial-yellow pb-2'>
                  {organization.endorserLevel.toUpperCase()}
                </div>
              </>
          }
        </div>
        {
          marker &&
            <DynamicOfficeMarker {...marker} />
        }
      </div>
      <div className='mt-8 card-title mb-3 text-dial-gray-dark'>{format('product.description')}</div>
      <div className='fr-view text-dial-gray-dark p-3'>
        {ReactHtmlParser(descriptionByLocale(organization.organizationDescriptions, locale))}
      </div>
      {
        organization.offices.length > 1 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('office.other.header')}</div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {
                organization.offices.map((office, i) => {
                  // Skipping the first one because it is displayed as map marker.
                  if (i === 0) return <></>
                  return <CityCard key={i} city={office} listType='list' />
                })
              }
            </div>
          </div>
      }
      {
        organization.sectorsWithLocale &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('sector.header')}</div>
            {
              organization.sectorsWithLocale.length > 0
                ? (
                  <div className='grid grid-cols-1 lg:grid-cols-2'>
                    {organization.sectorsWithLocale.map((sector, i) => <SectorCard key={i} sector={sector} listType='list' />)}
                  </div>
                  )
                : <div className='text-sm pb-5 text-button-gray'>{format('organization.no-sector')}</div>
            }
          </div>
      }
      {
        organization.countries &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('country.header')}</div>
            {
              organization.countries.length > 0
                ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                    {organization.countries.map((country, i) => <CountryCard key={i} country={country} listType='list' />)}
                  </div>
                  )
                : <div className='text-sm pb-5 text-button-gray'>{format('organization.no-country')}</div>
            }
          </div>
      }
      {
        organization.products && organization.products.length > 0 &&
          <div className='mt-12'>
            <div className='card-title mb-3 text-dial-gray-dark'>{format('product.header')}</div>
            {organization.products.map((product, i) => <ProductCard key={i} product={product} listType='list' />)}
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
      {
        organization.isMni &&
          <div className='mt-12'>
            <div className='card-title mb-3'>{format('operator.header')}</div>
            <AggregatorCapability aggregatorId={organization.id} />
          </div>
      }
    </div>
  )
}

export default OrganizationDetailRight
