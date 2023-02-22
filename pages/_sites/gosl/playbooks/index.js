/* eslint-disable max-len */
import Head from 'next/head'
import { useIntl } from 'react-intl'
import { useContext } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageContent from '../../../../components/main/PageContent'
import SearchFilter from '../../../../components/shared/SearchFilter'
import PlaybookFilter from '../../../../components/playbooks/PlaybookFilter'
import PlaybookActiveFilter from '../../../../components/playbooks/PlaybookActiveFilter'
import PlaybookHint from '../../../../components/filter/hint/PlaybookHint'
import { PlaybookFilterContext, PlaybookFilterDispatchContext } from '../../../../components/context/PlaybookFilterContext'
import ClientOnly from '../../../../lib/ClientOnly'
const PlaybookListQuery = dynamic(() => import('../../../../components/playbooks/PlaybookList'), { ssr: false })

const Playbooks = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const { search } = useContext(PlaybookFilterContext)
  const { setSearch } = useContext(PlaybookFilterDispatchContext)

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='text-dial-gray-dark my-5 mx-10 text-xl'>The following playbooks have been to support migration of various platforms as part of the EA Digital Transformation process</div>
      <ClientOnly>
        <PageContent
          activeTab='filter.entity.playbooks'
          filter={<PlaybookFilter />}
          content={<PlaybookListQuery />}
          searchFilter={<SearchFilter {...{ search, setSearch }} hint='filter.entity.playbooks' />}
          activeFilter={<PlaybookActiveFilter />}
          hint={<PlaybookHint />}
        />
      </ClientOnly>
      <Footer />
    </>
  )
}

export default Playbooks
