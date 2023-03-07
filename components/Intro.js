import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import cookie from 'react-cookies'
import dynamic from 'next/dynamic'

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), { ssr: false })

export const OVERVIEW_INTRO_KEY = 'intro.overview.completed'
export const OVERVIEW_INTRO_STEPS = [
  {
    element: '.intro-overview-element',
    i18nKey: 'intro.overview'
  }, {
    element: '.intro-overview-sdg-framework',
    i18nKey: 'intro.overview.sdgFramework',
    position: 'right'
  }, {
    element: '.intro-overview-entity-product',
    i18nKey: 'intro.overview.entityProduct'
  }, {
    element: '.intro-overview-entity-help',
    i18nKey: 'intro.overview.entityHelp',
    position: 'right'
  }, {
    element: '.intro-overview-search',
    i18nKey: 'intro.overview.search'
  }, {
    element: '.intro-overview-filter',
    i18nKey: 'intro.overview.filter'
  }, {
    element: '.intro-overview-card-view',
    i18nKey: 'intro.overview.cardView',
    position: 'top'
  }, {
    element: '.intro-overview-entity-playbook',
    i18nKey: 'intro.overview.entityPlaybook',
    position: 'left'
  }, {
    element: '.intro-overview-wizard',
    i18nKey: 'intro.overview.wizard'
  }, {
    element: '.intro-overview-signup',
    i18nKey: 'intro.overview.signUp'
  }
]

const Intro = ({ enabled, steps, startIndex, endIndex, previousPath, nextPath, completedKey }) => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const onBeforeChangeHandler = (nextStepIndex) => {
    if (typeof nextPath !== 'undefined' && nextStepIndex === endIndex + 1) {
      router.push(`/${nextPath}`)

      return false
    }

    if (typeof previousPath !== 'undefined' && nextStepIndex === startIndex - 1) {
      router.push(`/${previousPath}`)

      return false
    }
  }

  const onExitHandler = () => {
    cookie.save(completedKey, true)
  }

  return (
    <Steps
      enabled={enabled}
      steps={steps.map(step => ({ ...step, intro: format(step.i18nKey) }))}
      initialStep={startIndex}
      onBeforeChange={onBeforeChangeHandler}
      onExit={onExitHandler}
      options={{ disableInteraction: true, exitOnOverlayClick: false }}
    />
  )
}

export default Intro
