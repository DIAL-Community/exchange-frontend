import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../ui/v1/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../ui/v1/shared/Footer'
import WorkflowDetail from '../../../ui/v1/workflow/WorkflowDetail'

const WorkflowPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { slug } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.workflow.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.workflow.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <WorkflowDetail slug={slug} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default WorkflowPage
