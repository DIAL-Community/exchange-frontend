import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), { ssr: false })

const Overview = ({ enabled, steps, startIndex, endIndex, previousPath, nextPath, completedKey }) => {
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
    Cookies.set(completedKey, true, { expires: 365 })
  }

  return (
    <Steps
      enabled={enabled}
      steps={steps.map(step => ({ ...step, intro: format(step.i18nKey) }))}
      initialStep={startIndex}
      onBeforeChange={onBeforeChangeHandler}
      onExit={onExitHandler}
      options={{
        disableInteraction: true,
        exitOnOverlayClick: false,
        skipLabel: 'Skip'
      }}
    />
  )
}

export default Overview
