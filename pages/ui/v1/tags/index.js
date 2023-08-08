import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import QueryNotification from '../../../../components/shared/QueryNotification'
import ClientOnly from '../../../../lib/ClientOnly'
import Header from '../../../../ui/v1/shared/Header'
import Footer from '../../../../ui/v1/shared/Footer'
import TagRibbon from '../../../../ui/v1/tag/TagRibbon'
import TagTabNav from '../../../../ui/v1/tag/TagTabNav'
import TagMain from '../../../../ui/v1/tag/TagMain'

const TagListPage = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <NextSeo
        title={format('ui.tag.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('tag.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <div className='flex flex-col'>
          <TagRibbon />
          <TagTabNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <TagMain activeTab={activeTab} />
        </div>
        <Footer />
      </ClientOnly>
    </>
  )
}

export default TagListPage
