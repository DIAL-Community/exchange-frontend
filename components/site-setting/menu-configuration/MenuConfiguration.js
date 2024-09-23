import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { SITE_SETTING_DETAIL_QUERY } from '../../shared/query/siteSetting'
import MenuConfigurationEditor from './MenuConfigurationEditor'

const MenuConfigurations = ({ slug }) => {
  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.siteSetting) {
    return <NotFound />
  }

  const { siteSetting: { menuConfigurations } } = data

  return (
    <div className='lg:px-8 xl:px-56 py-4 min-h-[75vh]'>
      <div className='flex flex-col gap-1'>
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
