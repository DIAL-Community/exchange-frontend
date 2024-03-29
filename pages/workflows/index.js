import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import WorkflowRibbon from '../../components/workflow/WorkflowRibbon'
import WorkflowTabNav from '../../components/workflow/WorkflowTabNav'
import WorkflowMain from '../../components/workflow/WorkflowMain'

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
            { entities: format('ui.workflow.header')?.toLocaleLowerCase() }
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
