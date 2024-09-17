import { useCallback, useContext, useState } from 'react'
import classNames from 'classnames'
import { NextSeo } from 'next-seo'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Tooltip } from 'react-tooltip'
import { SiteSettingContext } from '../../../components/context/SiteSettingContext'
import Footer from '../../../components/shared/Footer'
import Header from '../../../components/shared/Header'
import QueryNotification from '../../../components/shared/QueryNotification'
import ClientOnly from '../../../lib/ClientOnly'

const MenuEditorPage = ({ defaultTenants }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <>
      <NextSeo
        title={format('ui.chatbot.header')}
        description={
          format(
            'shared.metadata.description.listOfKey',
            { entities: format('ui.chatbot.header')?.toLocaleLowerCase() }
          )
        }
      />
      <ClientOnly clientTenants={defaultTenants}>
        <QueryNotification />
        <Header />
        <Tooltip id='react-tooltip' className='tooltip-prose z-20' />
        <MainMenuEditor />
        <Footer />
      </ClientOnly>
    </>
  )
}

const MainMenuEditor = () => {
  const { menuConfigurations } = useContext(SiteSettingContext)

  return (
    <div className='flex flex-col gap-1'>
      {
        menuConfigurations.map((menuConfiguration) => {
          return (
            <div
              key={menuConfiguration.slug}
              data-menu={menuConfiguration.slug}
              className='flex flex-col gap-1'
            >
              <MenuEditor menuConfiguration={menuConfiguration} />
              <div className='ml-8 flex flex-col gap-1'>
                {menuConfiguration.menuItems.map(menuItem => {
                  return (
                    <MenuEditor key={menuItem.slug} menuConfiguration={menuItem} />
                  )
                })}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

const MenuEditor = ({ menuConfiguration }) => {
  const [openingDetail, setOpeningDetail] = useState(false)

  const toggleDetail = () => {
    setOpeningDetail(!openingDetail)
  }

  return (
    <div className='flex flex-col'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div
          className={classNames(
            'animated-collapse',
            openingDetail ? 'header-expanded' : 'header-collapsed',
            'collapse-animation bg-dial-sapphire h-14'
          )}
        />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleDetail}>
            <div className='font-semibold px-4 py-4'>
              {menuConfiguration.name}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2 pb-3 lg:pb-0'>
              <button
                type='button'
                onClick={toggleDetail}
                className='cursor-pointer bg-white px-2 py-1.5 rounded'
              >
                {openingDetail
                  ? <BsChevronUp className='cursor-pointer p-01 text-dial-stratos'/>
                  : <BsChevronDown className='cursor-pointer p-0.5 text-dial-stratos'/>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${openingDetail ? 'slide-down' : 'slide-up'}`}>
        <div className='px-4 py-4'>
          Nulla quis tortor non mi auctor hendrerit. Aenean venenatis sit amet enim a fringilla.
          Sed vitae ante felis. Ut dolor dolor, semper at feugiat vel, fringilla mattis metus.
          Nullam eros nulla, egestas a convallis et, volutpat quis est. Suspendisse eleifend
          pulvinar sagittis. Morbi leo enim, ultrices vel odio at, tincidunt congue leo.
          Vestibulum sit amet metus convallis, efficitur est at, suscipit urna. Aenean ultricies
          nisl in malesuada venenatis. Fusce efficitur dictum turpis eget dapibus.
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/tenants')
  const { defaultTenants } = await response.json()

  // Passing data to the page as props
  return { props: { defaultTenants } }
}

export default MenuEditorPage
