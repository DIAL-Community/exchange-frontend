import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import WorkflowRibbon from '../../../../ui/v1/workflow/WorkflowRibbon'
import WorkflowTabNav from '../../../../ui/v1/workflow/WorkflowTabNav'
import WorkflowMain from '../../../../ui/v1/workflow/WorkflowMain'

const WorkflowListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.workflow.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('workflow.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <WorkflowRibbon />
          <WorkflowTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <WorkflowMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default WorkflowListPage
