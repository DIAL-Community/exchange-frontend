import { useContext, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { MdAdd, MdEdit, MdFontDownload, MdOutlineDelete, MdOutlineSettings } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { useActiveTenant, useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { SiteSettingContext } from '../../context/SiteSettingContext'
import { isDebugLoggingEnabled } from '../../utils/utilities'
import { HtmlEditor } from '../form/HtmlEditor'
import { HtmlViewer } from '../form/HtmlViewer'
import Input from '../form/Input'
import Select from '../form/Select'
import HeroCarousel from '../HeroCarousel'
import { UPDATE_SITE_SETTING_ITEM_SETTINGS } from '../mutation/siteSetting'
import { DEFAULT_SITE_SETTING_ITEM_SETTINGS_QUERY } from '../query/siteSetting'
import { ExternalHeroCardDefinition, InternalHeroCardDefinition } from '../ToolDefinition'
import { layoutBreakpoints, layoutGridColumns, layoutGridHeight, layoutMargins, resizeHandles } from './config'
import { listOptions, mapOptions, WidgetTypeOptions } from './constants'
import ItemOptionsDialog from './ItemOptionsDialog'
import { resolveListValue, resolveMapValue, useWindowWidth } from './utilities'

const ConfigurableLanding = () => {
  const { country } = useActiveTenant()
  const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), [])

  const { slug, heroCardSection: { heroCardConfigurations } } = useContext(SiteSettingContext)

  // Toggle whether we are editing the page or not.
  const [editing, setEditing] = useState(false)
  // Toggle whether we are editing text or not (to display html editor or html viewer).
  const [editingText, setEditingText] = useState(false)

  const { isAdminUser } = useUser()
  const editingAllowed = isAdminUser

  // Items configurations across multiple screen breakpoints and the layout settings
  const [itemLayouts, setItemLayouts] = useState({})
  const [itemConfigurations, setItemConfigurations] = useState([])

  // Current screen width, will be used to find the current screen breakpoint.
  const windowWidth = useWindowWidth()
  // List of items on the current layout based on the screen breakpoint (only ids).
  const [currentItems, setCurrentItems] = useState([])

  // Setting changes to be applied to this item.
  const [activeItem, setActiveItem] = useState(null)
  const [activeItemTitle, setActiveItemTitle] = useState(null)
  // Toggle to display the setting dialog box.
  const [displayItemOptions, setDisplayItemOptions] = useState(false)

  // Initialize the layouts and items from database
  useQuery(DEFAULT_SITE_SETTING_ITEM_SETTINGS_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    },
    onCompleted: (data) => {
      if (data.defaultSiteSetting) {
        const { defaultSiteSetting: { itemLayouts, itemConfigurations } } = data
        // Resolve the item layouts and item configurations
        const currentItemLayouts = itemLayouts?.layouts ?? {}
        const currentItemConfigurations = itemConfigurations?.items ?? []
        // Find the current active breakpoint and then find all elements that are on the screen.
        const currentBreakout = Responsive.utils.getBreakpointFromWidth(layoutBreakpoints, windowWidth)
        const currentLayout = currentItemLayouts[currentBreakout]
        setCurrentItems(currentLayout.map(layout => layout.i))
        // Initialize item data and layout data in the current state for rendering.
        // Set the static field of the layouts based on the editing flag
        const newItemLayouts = {}
        Object.keys(currentItemLayouts).forEach(key => {
          newItemLayouts[key] = currentItemLayouts[key].map(itemLayout => ({ ...itemLayout, static: !editing }))
        })
        setItemLayouts(newItemLayouts)
        setItemConfigurations(currentItemConfigurations)
      }
    }
  })

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [saveItemSettings, { reset }] = useMutation(UPDATE_SITE_SETTING_ITEM_SETTINGS, {
    onCompleted: (data) => {
      const { updateSiteSettingItemSettings: response } = data
      if (response.siteSetting && response?.errors?.length === 0) {
        showSuccessMessage(<FormattedMessage id='landing.page.save.success' />)
      } else {
        showFailureMessage(<FormattedMessage id='landing.page.save.failure' />)
      }
    },
    onError: () => {
      showFailureMessage(<FormattedMessage id='landing.page.save.failure' />)
      reset()
    }
  })

  // Toggle the editing context for the current page.
  const toggleEditing = () => {
    // Toggle the editing flag for the current page.
    setEditing(!editing)
    // Set the static field of the layouts based on the editing flag
    const newItemLayouts = {}
    Object.keys(itemLayouts).forEach(key => {
      newItemLayouts[key] = itemLayouts[key].map(itemLayout => ({ ...itemLayout, static: editing }))
    })
    setItemLayouts(newItemLayouts)
    // Save the changes to the database.
    if (editing) {
      saveItemSettings({
        variables: {
          itemLayouts,
          itemConfigurations
        }
      })
    }
  }

  // Toggle the editing context for the text editor page.
  const toggleEditingText = () => {
    setEditingText(!editingText)
    // Save the changes to the database.
    if (editingText) {
      saveItemSettings({
        variables: {
          itemLayouts,
          itemConfigurations
        }
      })
    }
  }

  // Save when user make changes to the layout.
  const onLayoutChange = (layout, layouts) => {
    if (isDebugLoggingEnabled()) {
      console.log('Handling layout change from react-grid-layout. Receiving: ', layouts)
    }

    setItemLayouts(layouts)
  }

  // Update rendered components depending on the selected value. Only for card widget.
  // User can add more hero widget from the site settings editor.
  const resolveCardValue = (itemValue) => {
    const heroCardConfiguration = heroCardConfigurations.find((configuration) => configuration.id === itemValue)

    return heroCardConfiguration
      ? heroCardConfiguration.external
        ? <ExternalHeroCardDefinition
          disabled={editing}
          key={heroCardConfiguration.slug}
          heroCardConfiguration={heroCardConfiguration}
        />
        : <InternalHeroCardDefinition
          disabled={editing}
          key={heroCardConfiguration.slug}
          heroCardConfiguration={heroCardConfiguration}
        />
      : null
  }

  // Handler called when user clicks the save button on the widget setting dialog.
  const closeItemOptionsDialog = () => {
    setDisplayItemOptions(false)
    updateItemTitle(activeItem.id, activeItemTitle)
  }

  // Handler for the item title on the widget setting dialog.
  const handleChange = (e) => setActiveItemTitle(e.target.value)

  // Update the title of the widget based on the value from the widget setting dialog.
  const updateItemTitle = (id, itemTitle) => {
    const newItemConfigurations = itemConfigurations.map((item) => {
      return item.id === id ? { ...item, title: itemTitle } : item
    })
    setItemConfigurations(newItemConfigurations)
  }

  // Update the value of the widget based on the value from the widget setting dialog.
  // This will be invoked immediately on the widget setting instead of after closing the dialog.
  const updateItemValue = (id, itemValue) => {
    const newItemConfigurations = itemConfigurations.map((item) => {
      return item.id === id ? { ...item, value: itemValue } : item
    })
    setItemConfigurations(newItemConfigurations)
  }

  // Prepare the widget settings dialog.
  const setupItemValue = (item) => {
    setActiveItem(item)
    setActiveItemTitle(item.title)
    setDisplayItemOptions(true)
  }

  // Render options for each widget type.
  // - Content list will have which entity list should be displayed.
  // - Content map will have which map should be displayed.
  // - Card will pull list of card from the site settings configuration
  // We will add text editor and calculated widget to display summary (e.g. total number of projects)
  const buildItemOptions = (item) => {
    switch (item?.type) {
      case WidgetTypeOptions.LIST:
        return (
          <div className='flex flex-col gap-y-2 text-sm'>
            <label htmlFor='active-item-value'>
              <FormattedMessage id='landing.list.options' />
            </label>
            <Select
              id='active-item-value'
              borderless
              className='text-sm'
              options={listOptions}
              onChange={(e) => updateItemValue(item.id, e.value)}
            />
            <span className='text-xs italic'>
              <FormattedMessage id='landing.widget.selected.value' />: {item.value}
            </span>
          </div>
        )
      case WidgetTypeOptions.MAP:
        return (
          <div className='flex flex-col gap-y-2 text-sm'>
            <label htmlFor='active-item-value'>
              <FormattedMessage id='landing.map.options' />
            </label>
            <Select
              id='active-item-value'
              borderless
              className='text-sm'
              options={mapOptions}
              onChange={(e) => updateItemValue(item.id, e.value)}
            />
          </div>
        )
      case WidgetTypeOptions.CARD:
        return (
          <div className='flex flex-col gap-y-2 text-sm'>
            <label htmlFor='active-item-value'>
              <FormattedMessage id='landing.card.options' />
            </label>
            <Select
              id='active-item-value'
              borderless
              className='text-sm'
              options={heroCardConfigurations.map((heroCardConfiguration) => {
                return {
                  label: heroCardConfiguration.name,
                  value: heroCardConfiguration.id
                }
              })}
              onChange={(e) => updateItemValue(item.id, e.value)}
            />
            <span className='text-xs italic'>
              <FormattedMessage id='landing.widget.selected.value' />:
              {heroCardConfigurations.find(c => c.id === item.value)?.name}
            </span>
          </div>
        )
      default:
        return null
    }
  }

  // Render the content container for the widget.
  const resolveContent = (item) => {
    switch (item.type) {
      case WidgetTypeOptions.CAROUSEL:
        return <HeroCarousel />
      case WidgetTypeOptions.CARD:
        return resolveCardValue(item.value)
      case WidgetTypeOptions.MAP:
        return resolveMapValue(item.value, country)
      case WidgetTypeOptions.LIST:
        return resolveListValue(item.value)
      case WidgetTypeOptions.SUMMARY:
        return <div className='text-xs'>Item type: {item.type}</div>
      case WidgetTypeOptions.SPACER:
        return <div />
      case WidgetTypeOptions.TEXT:
        return editingText
          ? <HtmlEditor initialContent={item.value} onChange={(html) => updateItemValue(item.id, html)} />
          : <HtmlViewer initialContent={item.value} onChange={(html) => updateItemValue(item.id, html)} />
      default:
        return null
    }
  }

  // Render the item inside the grid-layout.
  const appendElement = (item) => {
    return (
      <div key={item.id}>
        <div className='flex flex-col gap-y-2 h-full'>
          {item.title &&
            <div className="text-sm font-medium">
              {item.title}
            </div>
          }
          {resolveContent(item)}
          {editing && (
            <div className='element-actions absolute top-1 right-1' style={{ zIndex: 50 }}>
              <div className='flex flex-row gap-x-1'>
                <button
                  className='cursor-pointer'
                  onClick={() => setupItemValue(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <MdOutlineSettings />
                </button>
                <button
                  className='cursor-pointer'
                  onClick={() => removeItem(item.id)}
                >
                  <MdOutlineDelete />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Remove an item from the grid-layout.
  const removeItem = (itemId) => {
    if (isDebugLoggingEnabled()) {
      console.log('Removing item with id: ', itemId)
    }

    setCurrentItems([...currentItems.filter(id => id !== itemId)])
    let itemCounts = 0
    Object.keys(itemLayouts).forEach(key => {
      if (itemLayouts[key].findIndex(layout => layout.i === itemId) !== -1) {
        itemCounts++
      }
    })

    if (isDebugLoggingEnabled()) {
      console.log('Item with the same id in the layout: ', itemCounts)
    }

    // If item is only used in the current layout, then remove it from the item configurations.
    // TODO: Maybe this consolidation / cleanup can be performed in the backend.
    // Go through each breakpoint's layout and remove items without reference in the layouts
    // from the item configurations.
    if (itemCounts === 1) {
      setItemConfigurations([...itemConfigurations.filter(item => item.id !== itemId)])
    }
  }

  // Append an item to the grid-layout. After appending the item to the item list,
  // the renderer will update itself because we updated the state.
  const appendItem = (itemType) => {
    const itemId = crypto.randomUUID()
    if (isDebugLoggingEnabled()) {
      console.log('Appending new item: ', itemId, ' with type: ', itemType)
    }

    setCurrentItems([...currentItems, itemId])
    setItemConfigurations([...itemConfigurations, {
      id: itemId,
      title: `Item ${itemConfigurations.length + 1}`,
      type: itemType
    }])
  }

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='relative flex flex-col min-h-[70vh]'>
        {editingAllowed &&
          <div className='absolute top-2 right-0 text-white' style={{ zIndex: 40 }}>
            <div className='flex flex-row gap-x-1'>
              <button
                className={classNames(
                  'bg-dial-sapphire px-2 py-2 rounded-full hover:opacity-100',
                  editingText ? 'opacity-80' : 'opacity-30'
                )}
                onClick={() => toggleEditingText()}
              >
                <MdFontDownload />
              </button>
              <button
                className={classNames(
                  'bg-dial-sapphire px-2 py-2 rounded-full hover:opacity-100',
                  editing ? 'opacity-80' : 'opacity-30'
                )}
                onClick={() => toggleEditing()}
              >
                <MdEdit />
              </button>
            </div>
          </div>
        }
        {editingAllowed && editing && (
          <div className='absolute top-2 right-20'>
            <div className='flex flex-wrap gap-1 text-xs text-white'>
              {Object.keys(WidgetTypeOptions).map(key => {
                return (
                  <button
                    key={key}
                    className={classNames(
                      'bg-dial-sapphire px-3 py-2 rounded flex gap-1 hover:opacity-100',
                      editing ? 'opacity-80' : 'opacity-30'
                    )}
                    onClick={() => appendItem(WidgetTypeOptions[key])}
                  >
                    <MdAdd className='my-auto' />
                    <FormattedMessage id={WidgetTypeOptions[key]} />
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {editing && <div className='spacer h-28 md:h-10' />}
        <ResponsiveReactGridLayout
          layouts={itemLayouts}
          margin={layoutMargins}
          cols={layoutGridColumns}
          rowHeight={layoutGridHeight}
          resizeHandles={resizeHandles}
          breakpoints={layoutBreakpoints}
          onLayoutChange={onLayoutChange}
          className='exchange-grid-layout'
          draggableCancel='.element-actions'
        >
          {currentItems.map(itemId => {
            const itemIndex = itemConfigurations.findIndex(item => item.id === itemId)

            return appendElement(itemConfigurations[itemIndex])
          })}
        </ResponsiveReactGridLayout>
        {activeItem &&
          <ItemOptionsDialog
            title={<FormattedMessage id='landing.widget.options.title' />}
            show={displayItemOptions}
            onClose={closeItemOptionsDialog}
          >
            <div className='form-field-wrapper'>
              <label htmlFor='active-item-name' className='flex flex-col gap-y-2 text-sm'>
                <FormattedMessage id='app.name' />
              </label>
              <Input
                id='active-item-name'
                value={activeItemTitle}
                onChange={handleChange}
              />
            </div>
            {buildItemOptions(activeItem)}
          </ItemOptionsDialog>
        }
      </div>
    </div>
  )
}

export default ConfigurableLanding
