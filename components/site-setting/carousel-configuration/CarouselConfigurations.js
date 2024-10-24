import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaPlus, FaSpinner } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { ToastContext } from '../../../lib/ToastContext'
import Breadcrumb from '../../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATIONS } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'
import CarouselConfiguration from './CarouselConfiguration'

const CarouselConfigurations = ({ slug }) => {
  const [mutating, setMutating] = useState(false)
  const [carouselConfigurations, setCarouselConfigurations] = useState([])

  const [carouselCounter, setCarouselCounter] = useState(1)

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug },
    onCompleted: (data) => {
      setCarouselConfigurations(data.siteSetting.carouselConfigurations)
      setCarouselCounter(data.siteSetting.carouselConfigurations.length)
    }
  })

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [bulkUpdateCarousel, { reset }] = useMutation(UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATIONS, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { updateSiteSettingCarouselConfigurations: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        setMutating(false)
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.carouselConfigurations.submitted' />)
        setCarouselConfigurations([...response.siteSetting.carouselConfigurations])
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.EDITING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.siteSetting) {
    return handleMissingData()
  }

  const buildCommonConfiguration = () => ({
    id: crypto.randomUUID(),
    external: false,
    imageUrl: 'style-1',
    calloutTitle: 'ui.siteSetting.carousel.defaultCalloutTitle',
    destinationUrl: '/',
    style: 'left-aligned',
    saved: false
  })

  const appendCarousel = () => {
    setCarouselConfigurations([
      ...carouselConfigurations,
      {
        ...buildCommonConfiguration(),
        type: 'generic-carousel',
        name: `Next Carousel ${carouselCounter}`,
        title: `Carousel Title ${carouselCounter}`,
        description: `Carousel Description ${carouselCounter}`
      }
    ])
    setCarouselCounter(carouselCounter + 1)
  }

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.slice(0, 1).toUpperCase() + txt.slice(1).toLowerCase()
    })
  }

  const appendDefaultCarousel = (type) => {
    const carouselType = `default.${type}.carousel`
    const carouselName = `${toTitleCase(type)} Carousel`
    setCarouselConfigurations([
      ...carouselConfigurations,
      {
        ...buildCommonConfiguration(),
        type: carouselType,
        name: carouselName,
        title: type === 'exchange' ? 'ui.hero.exchange.title' : 'ui.marketplace.label',
        description: type === 'exchange' ? 'ui.hero.exchange.tagLine' : 'ui.marketplace.description'
      }
    ])
  }

  const executeBulkUpdate = () => {
    setMutating(true)
    const variables = {
      siteSettingSlug: slug,
      carouselConfigurations
    }

    bulkUpdateCarousel({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
  }

  const { siteSetting } = data

  const slugNameMapping = (() => {
    const map = {}
    map[siteSetting.slug] = siteSetting.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 min-h-[75vh]'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col gap-1 py-4'>
        <div className='flex gap-1 ml-auto mb-3'>
          {['exchange', 'marketplace']
            .filter((type) => {
              return carouselConfigurations.findIndex((m) => m.type === `default.${type}.carousel`) < 0
            })
            .map((type) => (
              <button
                key={type}
                type='button'
                className='submit-button'
                onClick={() => appendDefaultCarousel(type)}
              >
                <div className='flex gap-1 text-sm'>
                  <FormattedMessage id={`ui.siteSetting.carousel.append${toTitleCase(type)}Carousel`} />
                  <FaPlus className='my-auto' />
                </div>
              </button>
            ))}
          <button type='button' className='submit-button' onClick={appendCarousel}>
            <div className='flex gap-1 text-sm'>
              <FormattedMessage id='ui.siteSetting.carousel.appendCarousel' />
              <FaPlus className='my-auto' />
            </div>
          </button>
        </div>
        {carouselConfigurations.map((carouselConfiguration, index) => {
          return (
            <div key={index} data-carousel={carouselConfiguration.id} className='flex flex-col gap-1'>
              <CarouselConfiguration
                siteSettingSlug={slug}
                carouselConfiguration={carouselConfiguration}
                carouselConfigurations={carouselConfigurations}
                setCarouselConfigurations={setCarouselConfigurations}
              />
            </div>
          )
        })}
        {carouselConfigurations.length > 0 && (
          <div className='flex ml-auto py-4'>
            <button type='button' onClick={executeBulkUpdate} className='submit-button' disabled={mutating}>
              <FormattedMessage id='ui.siteSetting.carouselConfigurations.save' />
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarouselConfigurations
