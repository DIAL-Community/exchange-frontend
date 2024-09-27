import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaPlus, FaSpinner } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { UPDATE_SITE_SETTING_HERO_CARD_SECTION } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'
import HeroCardConfiguration from './HeroCardConfiguration'

const HeroCardSection = ({ slug }) => {
  const [mutating, setMutating] = useState(false)
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [heroCardConfigurations, setHeroCardConfigurations] = useState([])

  const [heroCardCounter, setHeroCardCounter] = useState(1)

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug },
    onCompleted: (data) => {
      const { siteSetting } = data
      if (siteSetting) {
        const { heroCardSection } = siteSetting
        setTitle(heroCardSection.title)
        setDescription(heroCardSection.description)
        // Save the hero configurations to the state
        setHeroCardConfigurations(heroCardSection.heroCardConfigurations ?? [])
      }
    }
  })

  const { user } = useUser()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [bulkUpdateHeroCard, { reset }] = useMutation(UPDATE_SITE_SETTING_HERO_CARD_SECTION, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { updateSiteSettingHeroCardSection: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        setMutating(false)
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.heroCardConfigurations.submitted' />)
        if (response.siteSetting) {
          const { heroCardSection } = response.siteSetting
          setTitle(heroCardSection.title)
          setDescription(heroCardSection.description)
          // Save the hero configurations to the state
          setHeroCardConfigurations(heroCardSection.heroCardConfigurations)
        }
      } else {
        const [firstErrorMessage] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.siteSetting) {
    return <NotFound />
  }

  const buildCommonConfiguration = () => ({
    id: crypto.randomUUID(),
    external: false,
    destinationUrl: '/',
    imageUrl: '/ui/v1/dial-header.svg',
    saved: false
  })

  const appendHeroCard = () => {
    setHeroCardConfigurations([
      ...heroCardConfigurations,
      {
        ...buildCommonConfiguration(),
        type: 'generic-heroCard',
        name: `Next Hero Card ${heroCardCounter}`,
        title: `Hero Card Title ${heroCardCounter}`,
        description: `Hero Card Description ${heroCardCounter}`
      }
    ])
    setHeroCardCounter(heroCardCounter + 1)
  }

  const appendDefaultHeroCard = (type) => {
    const heroCardType = `default.${toVariableCase(type)}.heroCard`
    const heroCardName = `${type} Hero Card`
    setHeroCardConfigurations([
      ...heroCardConfigurations,
      {
        ...buildCommonConfiguration(),
        type: heroCardType,
        name: heroCardName,
        title: type === 'Use Case'
          ? 'ui.useCase.header'
          : type === 'Product'
            ? 'ui.product.header'
            : 'ui.buildingBlock.header',
        description: type === 'Use Case'
          ? 'useCase.hint.subtitle'
          : type === 'Product'
            ? 'product.hint.subtitle'
            : 'buildingBlock.hint.subtitle',
        imageUrl: `/ui/v1/${toUrlCase(type)}-header.svg`,
        external: false,
        destinationUrl: `/${toUrlCase(type)}s`
      }
    ])
  }

  const executeBulkUpdate = () => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const variables = {
        siteSettingSlug: slug,
        title,
        description,
        heroCardConfigurations
      }

      bulkUpdateHeroCard({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const { siteSetting } = data

  const slugNameMapping = (() => {
    const map = {}
    map[siteSetting.slug] = siteSetting.name

    return map
  })()

  const stripBlanks = (str) => {
    return str.replace(/\s+/g, '')
  }

  const toUrlCase = (str) => {
    return str.replace(/(\s+)/g, '-').toLowerCase()
  }

  const toVariableCase = (str) => {
    return str.replace(/(\s+)/g, '').replace(/^./, (str) => str.toLowerCase())
  }

  return (
    <div className='lg:px-8 xl:px-56 min-h-[75vh]'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col gap-1 py-4'>
        <div className='flex gap-1 ml-auto mb-3'>
          {['Use Case', 'Building Block', 'Product']
            .filter((type) => {
              return heroCardConfigurations
                .findIndex((m) => m.type === `default.${toVariableCase(type)}.heroCard`) < 0
            })
            .map((type) => (
              <button
                key={type}
                type='button'
                className='submit-button'
                onClick={() => appendDefaultHeroCard(type)}
              >
                <div className='flex gap-1 text-sm'>
                  <FormattedMessage id={`ui.siteSetting.heroCard.append${stripBlanks(type)}HeroCard`} />
                  <FaPlus className='my-auto' />
                </div>
              </button>
            ))}
          <button type='button' className='submit-button' onClick={appendHeroCard}>
            <div className='flex gap-1 text-sm'>
              <FormattedMessage id='ui.siteSetting.heroCard.appendHeroCard' />
              <FaPlus className='my-auto' />
            </div>
          </button>
        </div>
        {heroCardConfigurations.map((heroCardConfiguration, index) => {
          return (
            <div key={index} data-hero-card={heroCardConfiguration.id} className='flex flex-col gap-1'>
              <HeroCardConfiguration
                siteSettingSlug={slug}
                heroCardConfiguration={heroCardConfiguration}
                heroCardConfigurations={heroCardConfigurations}
                setHeroCardConfigurations={setHeroCardConfigurations}
              />
            </div>
          )
        })}
        {heroCardConfigurations.length > 0 && (
          <div className='flex ml-auto py-4'>
            <button type='button' onClick={executeBulkUpdate} className='submit-button' disabled={mutating}>
              <FormattedMessage id='ui.siteSetting.heroCardConfigurations.save' />
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroCardSection
