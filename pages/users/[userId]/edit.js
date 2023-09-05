import { NextSeo } from 'next-seo'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import Header from '../../../ui/v1/shared/Header'
import ClientOnly from '../../../lib/ClientOnly'
import Footer from '../../../ui/v1/shared/Footer'
import UserEdit from '../../../ui/v1/user/UserEdit'

const EditUser = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { query: { userId } } = useRouter()

  return (
    <>
      <NextSeo
        title={format('ui.user.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.user.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly>
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <UserEdit userId={userId} />
        <Footer />
      </ClientOnly>
    </>
  )
}

export default EditUser
