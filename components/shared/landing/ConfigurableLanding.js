import { useContext, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { MdAdd, MdEdit, MdFontDownload, MdOutlineDelete, MdOutlineSettings } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { SiteSettingContext } from '../../context/SiteSettingContext'
import { HtmlEditor } from '../form/HtmlEditor'
import { HtmlViewer } from '../form/HtmlViewer'
import Input from '../form/Input'
import Select from '../form/Select'
import HeroCarousel from '../HeroCarousel'
import { ExternalHeroCardDefinition, InternalHeroCardDefinition } from '../ToolDefinition'
import { ContentListOptions, ContentMapOptions, WidgetTypeOptions } from './constants'
import ItemOptionsDialog from './ItemOptionsDialog'
import { getFromLocalStorage, resolveContentListValue, resolveContentMapValue, saveToLocalStorage } from './utilities'

const ConfigurableLanding = () => {
  const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), [])

  const { heroCardSection: { heroCardConfigurations } } = useContext(SiteSettingContext)

  // Toggle whether we are editing the page or not.
  const [editing, setEditing] = useState(false)
  const [editingText, setEditingText] = useState(false)

  // Items on the page and the layout settings
  const [items, setItems] = useState([])
  const [layouts, setLayouts] = useState({})

  const [activeItem, setActiveItem] = useState(null)
  const [activeItemTitle, setActiveItemTitle] = useState(null)

  const [displayItemOptions, setDisplayItemOptions] = useState(false)

  // Initialize the items and the layouts from local storage.
  // Eventually we will move this to the site_settings table.
  useEffect(() => {
    setItems(getFromLocalStorage('exchange-items') ?? [])
    const savedLayouts = getFromLocalStorage('exchange-layouts') ?? {}
    const updatedLayouts = {}
    Object.keys(savedLayouts).map(key => {
      const processedLayouts = savedLayouts[key].map(currentLayout => {
        return { ...currentLayout, static: !editing }
      })
      updatedLayouts[key] = processedLayouts
    })
    setLayouts(updatedLayouts)
  }, [editing])

  // Toggle the editing context for the current page.
  const toggleEditing = () => {
    setEditing(!editing)
  }

  // Toggle the editing context for the text editor page.
  const toggleEditingText = () => {
    setEditingText(!editingText)
  }

  // Save when user make changes to the layout.
  const onLayoutChange = (_layout, layouts) => {
    console.log('Handling layout change. Saving: ', layouts)
    saveToLocalStorage('exchange-layouts', layouts)
  }

  // Update rendered components depending on the selected value.
  // This is specific for hero card widget. User can add more hero widget from the site settings editor.
  const resolveHeroCardValue = (itemValue) => {
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
    const newItems = items.map((item) => {
      return item.id === id ? { ...item, title: itemTitle } : item
    })
    setItems(newItems)
    saveToLocalStorage('exchange-items', newItems)
  }

  // Update the value of the widget based on the value from the widget setting dialog.
  // This will be invoked immediately on the widget setting instead of after closing the dialog.
  const updateItemValue = (id, itemValue) => {
    const newItems = items.map((item) => {
      return item.id === id ? { ...item, value: itemValue } : item
    })
    setItems(newItems)
    saveToLocalStorage('exchange-items', newItems)
  }

  // Prepare the widget settings dialog.
  const setupItemValue = (item) => {
    setActiveItem(item)
    setActiveItemTitle(item.title)
    setDisplayItemOptions(true)
  }

  // Render options for each widget type.
  // Content list will have which entity list should be displayed.
  // Content map will have which map should be displayed.
  // Hero card will pull list of hero card from the site settings configuration
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
              options={ContentListOptions}
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
              options={ContentMapOptions}
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
        return resolveHeroCardValue(item.value)
      case WidgetTypeOptions.MAP:
        return resolveContentMapValue(item.value)
      case WidgetTypeOptions.LIST:
        return resolveContentListValue(item.value)
      case WidgetTypeOptions.SUMMARY:
        return <div className='text-xs'>Item type: {item.type}</div>
      case WidgetTypeOptions.SPACER:
        return <div />
      case WidgetTypeOptions.BLOCK:
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
    console.log('Removing item: ', itemId)
    const updatedItems = [...items.filter(item => item.id !== itemId)]
    setItems(updatedItems)
    saveToLocalStorage('exchange-items', updatedItems)
  }

  // Append an item to the grid-layout.
  const appendItem = (itemType) => {
    const itemId = crypto.randomUUID()
    console.log('Appending item: ', itemId)
    const updatedItems = [...items, {
      id: itemId,
      title: `Item ${items.length + 1}`,
      type: itemType
    }]
    setItems(updatedItems)
    saveToLocalStorage('exchange-items', updatedItems)
  }

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <div className='relative flex flex-col min-h-[70vh]'>
        <div className='absolute top-2 right-0 text-white' style={{ zIndex: 55 }}>
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
        {editing && (
          <div className='absolute top-2 right-20'>
            <div className='flex gap-1 text-xs text-white'>
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
        {editing && <div className='spacer h-10' />}
        <ResponsiveReactGridLayout
          draggableCancel='.element-actions'
          className='exchange-grid-layout'
          margin={[8, 8]}
          resizeHandles={['sw', 'se']}
          cols={{ lg: 12, md: 6, sm: 2 }}
          breakpoints={{ lg: 1024, md: 768, sm: 640 }}
          rowHeight={16}
          layouts={layouts}
          onLayoutChange={onLayoutChange}
        >
          {items.map(item => appendElement(item))}
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
