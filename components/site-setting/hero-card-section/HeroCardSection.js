import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaPlus, FaSpinner } from 'react-icons/fa6'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { HtmlEditor } from '../../shared/form/HtmlEditor'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import Input from '../../shared/form/Input'
import ValidationError from '../../shared/form/ValidationError'
import { UPDATE_SITE_SETTING_HERO_CARD_SECTION } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'
import { stripBlanks, toUrlCase, toVariableCase } from '../utilities'
import HeroCardConfiguration from './HeroCardConfiguration'

const HeroCardSectionEditor = ({ siteSettingSlug, heroCardSection }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { title, description, wysiwygDescription, heroCardConfigurations } = heroCardSection

  const { locale } = useRouter()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

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
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.heroSection.submitted' />)
      } else {
        const [firstErrorMessage] = response.errors
        showFailureMessage(firstErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  const { handleSubmit, register, watch, control, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      title,
      description,
      wysiwygDescription
    }
  })

  const currentTitle = watch('title')
  const currentDescription = watch('description')
  const currentWysiwygDescription = watch('wysiwygDescription')

  const [mutating, setMutating] = useState(false)
  const { user, loadingUserSession } = useUser()

  const executeBulkUpdate = async (data) => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const { title, description, wysiwygDescription } = data
      const variables = {
        siteSettingSlug,
        title,
        description,
        wysiwygDescription,
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

  return loadingUserSession
    ? <Loading />
    : (
      <div className='flex flex-col gap-y-6'>
        <form onSubmit={handleSubmit(executeBulkUpdate)} className='border-b border-solid'>
          <div className='px-6 py-6'>
            <div className='flex flex-col gap-y-6 text-sm'>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='title'>
                  {format('ui.siteSetting.heroSection.title')}
                </label>
                <Input
                  {...register('title', { required: format('validation.required') })}
                  id='title'
                  placeholder={format('ui.siteSetting.heroSection.title')}
                  isInvalid={errors.title}
                />
                {errors.title && <ValidationError value={errors.title?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label className='required-field' htmlFor='description'>
                  {format('ui.siteSetting.heroSection.description')}
                </label>
                <Input
                  {...register('description', { required: format('validation.required') })}
                  id='description'
                  placeholder={format('ui.siteSetting.heroSection.description')}
                  isInvalid={errors.description}
                />
                {errors.description && <ValidationError value={errors.description?.message} />}
              </div>
              <div className='flex flex-col gap-y-2'>
                <label for='wysiwyg-description'>
                  {format('ui.siteSetting.heroSection.wysiwygDescription')}
                </label>
                <Controller
                  name='wysiwygDescription'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <HtmlEditor
                      id='wysiwyg-description'
                      editorId='wysiwyg-description'
                      onChange={onChange}
                      initialContent={value}
                      placeholder={format('ui.siteSetting.heroSection.wysiwygDescription')}
                      isInvalid={errors.wysiwygDescription}
                    />
                  )}
                />
              </div>
              <div className='flex flex-wrap text-sm gap-3'>
                <button type='submit' className='submit-button' disabled={mutating}>
                  {format('ui.siteSetting.heroSection.save')}
                  {mutating && <FaSpinner className='spinner ml-3 inline' />}
                </button>
              </div>
            </div>
          </div>
        </form>
        {currentWysiwygDescription
          ? <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
            <HtmlViewer initialContent={currentWysiwygDescription} />
          </div>
          : <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-8'>
            <div className='text-2xl font-semibold'>
              {currentTitle &&
                <FormattedMessage
                  id={currentTitle}
                  defaultMessage={currentTitle}
                />
              }
            </div>
            <div className='text-sm max-w-5xl'>
              {currentDescription &&
                <FormattedMessage
                  id={currentDescription}
                  defaultMessage={currentDescription}
                />
              }
            </div>
          </div>
        }
      </div>
    )
}

const HeroCardSection = ({ slug }) => {

  const [mutating, setMutating] = useState(false)
  const [heroCardConfigurations, setHeroCardConfigurations] = useState([])

  const [heroCardCounter, setHeroCardCounter] = useState(1)

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug },
    onCompleted: (data) => {
      const { siteSetting } = data
      if (siteSetting) {
        const { heroCardSection } = siteSetting
        // Save the hero configurations to the state
        setHeroCardConfigurations(heroCardSection.heroCardConfigurations ?? [])
        setHeroCardCounter(heroCardSection.heroCardConfigurations?.length ?? 1)
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
    imageUrl: '//exchange.dial.global/ui/v1/dial-logo.svg',
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

  return (
    <div className='lg:px-8 xl:px-56 min-h-[75vh]'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col gap-1 py-4'>
        <HeroCardSectionEditor
          siteSettingSlug={slug}
          heroCardSection={siteSetting.heroCardSection}
        />
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
