import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import TaskTrackerRibbon from '../../components/task-tracker/TaskTrackerRibbon'
import TaskTrackerTabNav from '../../components/task-tracker/TaskTrackerTabNav'
import TaskTrackerMain from '../../components/task-tracker/TaskTrackerMain'

const TaskTrackerListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.taskTracker.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.taskTracker.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <TaskTrackerRibbon />
          <TaskTrackerTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <TaskTrackerMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default TaskTrackerListPage
