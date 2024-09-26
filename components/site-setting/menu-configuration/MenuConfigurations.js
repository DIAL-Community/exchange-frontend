import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaPlus, FaSpinner } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { UPDATE_SITE_SETTING_MENU_CONFIGURATIONS } from '../../shared/mutation/siteSetting'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'
import MenuConfiguration from './MenuConfiguration'

const MenuConfigurations = ({ slug }) => {
  const [mutating, setMutating] = useState(false)
  const [menuConfigurations, setMenuConfigurations] = useState([])

  const [menuCounter, setMenuCounter] = useState(0)
  const [menuItemCounter, setMenuItemCounter] = useState(0)

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug },
    onCompleted: (data) => {
      setMenuConfigurations(data.siteSetting.menuConfigurations)
      let menuCounter = 0
      let menuItemCounter = 0
      data.siteSetting.menuConfigurations.forEach((menuConfiguration) => {
        menuCounter += 1
        menuItemCounter += menuConfiguration.menuItemConfigurations.length
      })
      setMenuCounter(menuCounter)
      setMenuItemCounter(menuItemCounter)
    }
  })

  const { user } = useUser()
  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { locale } = useRouter()
  const [bulkUpdateMenu, { reset }] = useMutation(UPDATE_SITE_SETTING_MENU_CONFIGURATIONS, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      setMutating(false)
      const { updateSiteSettingMenuConfigurations: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        setMutating(false)
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.menuConfigurations.submitted' />)
        setMenuConfigurations([...response.siteSetting.menuConfigurations])
      } else {
        const [ initialErrorMessage ] = response.errors
        showFailureMessage(initialErrorMessage)
        setMutating(false)
        reset()
      }
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.siteSetting) {
    return <NotFound />
  }

  const buildCommonConfiguration = () => ({
    id: crypto.randomUUID(),
    external: false,
    destinationUrl: '/',
    parentSlug: 'n/a',
    saved: false
  })

  const appendMenu = () => {
    setMenuConfigurations([
      ...menuConfigurations,
      {
        ...buildCommonConfiguration(),
        type: 'menu',
        name: `Next Menu ${menuCounter + 1}`,
        menuItemConfigurations: []
      }
    ])
    setMenuCounter(menuCounter + 1)
  }

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.slice(0, 1).toUpperCase() + txt.slice(1).toLowerCase()
    })
  }

  const appendDefaultMenu = (type) => {
    const menuType = `locked-${type}-menu`
    const menuName = `${toTitleCase(type)} Menu`
    setMenuConfigurations([
      ...menuConfigurations,
      {
        ...buildCommonConfiguration(),
        type: menuType,
        name: menuName,
        menuItemConfigurations: []
      }
    ])
  }

  const appendMenuItem = (parentMenuId) => {
    // Create copy of the existing menu configurations
    const currentMenuConfigurations = [...menuConfigurations]
    const existingParentIndex = currentMenuConfigurations.findIndex((m) => m.id === parentMenuId)
    const existingParentMenu = currentMenuConfigurations[existingParentIndex]
    // Create new menu configuration using existing parent menu
    // and then append the new menu item to the parent menu.
    const currentParentMenu = {
      ...existingParentMenu,
      menuItemConfigurations: [
        ...existingParentMenu.menuItemConfigurations,
        {
          ...buildCommonConfiguration(),
          type: 'menu-item',
          name: `Next Menu Item ${menuItemCounter + 1}`
        }
      ]
    }
    // Replace the previous parent menu (using the index) with the updated parent menu.
    currentMenuConfigurations[existingParentIndex] = currentParentMenu
    setMenuConfigurations([...currentMenuConfigurations])
    setMenuItemCounter(menuItemCounter + 1)
  }

  const executeBulkUpdate = () => {
    if (user) {
      setMutating(true)
      const { userEmail, userToken } = user
      const variables = {
        siteSettingSlug: slug,
        menuConfigurations
      }

      bulkUpdateMenu({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const { siteSetting } = data

  const slugNameMapping = (() => {
    const map = {}
    map[siteSetting.slug] = siteSetting.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 min-h-[75vh]'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='flex flex-col gap-1 py-4'>
        <div className='flex gap-1 ml-auto mb-3'>
          {['admin', 'login', 'help', 'language']
            .filter((type) => {
              return menuConfigurations.findIndex((m) => m.type === `locked-${type}-menu`) < 0
            })
            .map((type) => (
              <button
                key={type}
                type='button'
                className='submit-button'
                onClick={() => appendDefaultMenu(type)}
              >
                <div className='flex gap-1 text-sm'>
                  <FormattedMessage id={`ui.siteSetting.menu.append${toTitleCase(type)}Menu`} />
                  <FaPlus className='my-auto' />
                </div>
              </button>
            ))}
          <button type='button' className='submit-button' onClick={appendMenu}>
            <div className='flex gap-1 text-sm'>
              <FormattedMessage id='ui.siteSetting.menu.appendMenu' />
              <FaPlus className='my-auto' />
            </div>
          </button>
        </div>
        {menuConfigurations.map((menuConfiguration, index) => {
          return (
            <div key={index} data-menu={menuConfiguration.id} className='flex flex-col gap-1'>
              <MenuConfiguration
                siteSettingSlug={slug}
                menuConfiguration={menuConfiguration}
                menuConfigurations={menuConfigurations}
                setMenuConfigurations={setMenuConfigurations}
                appendMenuItem={appendMenuItem}
              />
              <div className='ml-8 flex flex-col gap-1'>
                {menuConfiguration.menuItemConfigurations.map((menuItem, index) => {
                  return (
                    <div key={index} data-menu-item={menuItem.id}>
                      <MenuConfiguration
                        siteSettingSlug={slug}
                        menuConfiguration={menuItem}
                        menuConfigurations={menuConfigurations}
                        setMenuConfigurations={setMenuConfigurations}
                        parentMenuConfiguration={menuConfiguration}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        {menuConfigurations.length > 0 && (
          <div className='flex ml-auto py-4'>
            <button type='button' onClick={executeBulkUpdate} className='submit-button' disabled={mutating}>
              <FormattedMessage id='ui.siteSetting.menuConfigurations.save' />
              {mutating && <FaSpinner className='spinner ml-3 inline' />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuConfigurations
