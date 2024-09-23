import { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'
import MenuConfigurationEditor from './MenuConfigurationEditor'

const MenuConfigurations = ({ slug }) => {
  const [menuConfigurations, setMenuConfigurations] = useState([])

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug },
    onCompleted: (data) => {
      setMenuConfigurations(data.siteSetting.menuConfigurations)
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.siteSetting) {
    return <NotFound />
  }

  const appendParentMenuConfiguration = () => {
    setMenuConfigurations([
      ...menuConfigurations,
      {
        slug: 'new-menu',
        name: 'New Menu',
        type: 'menu',
        menuItems: []
      }
    ])
  }

  return (
    <div className='lg:px-8 xl:px-56 py-4 min-h-[75vh]'>
      <div className='flex flex-col gap-1'>
        <div className='flex ml-auto mb-3'>
          <button type='button' className='submit-button' onClick={appendParentMenuConfiguration}>
            <div className='flex gap-1'>
              Add Menu
              <FaPlus className='my-auto' size='1rem' />
            </div>
          </button>
        </div>
        {menuConfigurations.map((menuConfiguration) => {
          return (
            <div
              key={menuConfiguration.slug}
              data-menu={menuConfiguration.slug}
              className='flex flex-col gap-1'
            >
              <MenuConfigurationEditor menuConfiguration={menuConfiguration} />
              <div className='ml-8 flex flex-col gap-1'>
                {menuConfiguration.menuItems.map(menuItem => {
                  return (
                    <MenuConfigurationEditor key={menuItem.slug} menuConfiguration={menuItem} />
                  )
                })}
              </div>
            </div>
          )
        })
        }</div>
    </div>
  )
}

export default MenuConfigurations
