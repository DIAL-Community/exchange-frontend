import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientOnly from '../../lib/ClientOnly'
import QueryNotification from '../../components/shared/QueryNotification'
import Header from '../../ui/v1/shared/Header'
import Footer from '../../ui/v1/shared/Footer'
import ProjectRibbon from '../../ui/v1/project/ProjectRibbon'
import ProjectTabNav from '../../ui/v1/project/ProjectTabNav'
import ProjectMain from '../../ui/v1/project/ProjectMain'

const ProjectListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.project.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.project.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <ProjectRibbon />
          <ProjectTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <ProjectMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default ProjectListPage
