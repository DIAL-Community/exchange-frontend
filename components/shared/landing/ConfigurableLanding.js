import { Fragment, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { MdOutlineDelete, MdOutlineSettings } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { Dialog, Transition } from '@headlessui/react'
import BuildingBlockListRight from '../../building-block/fragments/BuildingBlockListRight'
import EndorserMap from '../../maps/endorsers/EndorserMap'
import ProjectMap from '../../maps/projects/ProjectMap'
import OrganizationListRight from '../../organization/fragments/OrganizationListRight'
import ProductListRight from '../../product/fragments/ProductListRight'
import ProjectListRight from '../../project/fragments/ProjectListRight'
import UseCaseListRight from '../../use-case/fragments/UseCaseListRight'
import { HtmlEditor } from '../form/HtmlEditor'
import Input from '../form/Input'
import Select from '../form/Select'
import HeroCarousel from '../HeroCarousel'
import { ContentListOptions, ContentListTypes, ContentMapOptions, ContentMapTypes, WidgetTypeOptions } from './constants'

const getFromLocalStorage = (localStorageKey) => {
  console.log(`Reading '${localStorageKey}' data from local storage.`)
  let localStorage
  if (global.localStorage) {
    try {
      localStorage = JSON.parse(global.localStorage.getItem(localStorageKey))
    } catch (e) {
      console.log('Unable to load layout information from local storage.', e)
    }
  }

  return localStorage
}

const saveToLocalStorage = (localStorageKey, value) => {
  console.log(`Saving '${localStorageKey}' data to local storage.`)
  if (global.localStorage) {
    global.localStorage.setItem(localStorageKey, JSON.stringify(value))
  }
}

const ItemOptionsDialog = ({ show, onClose, children }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-100 overflow-y-auto'
        onClose={() => {}}
      >
        <div className='min-h-screen px-4 text-center'>
          <Dialog.Overlay className='fixed inset-0 bg-dial-gray opacity-40' />
          <span
            className='inline-block h-screen align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div
              className={classNames(
                'inline-block w-full max-w-3xl px-8 py-6 text-left',
                'transition-all transform bg-white shadow-xl rounded'
              )}
            >
              <Dialog.Title>
                <div className='pb-4 font-semibold'>
                  Editing Item Options
                </div>
              </Dialog.Title>
              <div className='flex flex-col gap-y-3'>
                {children}
                <div className='flex justify-end text-xs text-white mt-2'>
                  <button className='bg-dial-sapphire px-3 py-2 rounded' onClick={onClose}>
                    <FormattedMessage id='app.save' />
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const ConfigurableLanding = () => {
  const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), [])

  const [items, setItems] = useState([])
  const [layouts, setLayouts] = useState({})

  const [activeItem, setActiveItem] = useState(null)
  const [activeItemTitle, setActiveItemTitle] = useState(null)

  const [displayItemOptions, setDisplayItemOptions] = useState(false)

  useEffect(() => {
    setItems(getFromLocalStorage('exchange-items') ?? [])
    setLayouts(getFromLocalStorage('exchange-layouts') ?? {})
  }, [])

  const onLayoutChange = (_layout, layouts) => {
    console.log('Handling layout change. Saving: ', layouts)
    saveToLocalStorage('exchange-layouts', layouts)
  }

  const resolveContentMapValue = (value) => {
    switch (value) {
      case ContentMapTypes.PROJECT_MAP:
        return <ProjectMap />
      case ContentMapTypes.ENDORSER_MAP:
        return <EndorserMap />
      default:
        return <div className='text-xs italic'>Unknown map value: {value}</div>
    }
  }

  const resolveContentListValue = (value) => {
    switch (value) {
      case ContentListTypes.PRODUCT_LIST:
        return <ProductListRight />
      case ContentListTypes.ORGANIZATION_LIST:
        return <OrganizationListRight />
      case ContentListTypes.USE_CASE_LIST:
        return <UseCaseListRight />
      case ContentListTypes.BUILDING_BLOCK_LIST:
        return <BuildingBlockListRight />
      case ContentListTypes.PROJECT_LIST:
        return <ProjectListRight />
      default:
        return <div className='text-xs italic'>Unknown map value: {value}</div>
    }
  }

  const resolveHeroCardValue = (itemValue) => {
    return <div className='text-xs italic'>Unknown map value: {itemValue}</div>
  }

  const closeItemOptionsDialog = () => {
    setDisplayItemOptions(false)
    updateItemTitle(activeItem.id, activeItemTitle)
  }

  const handleChange = (e) => setActiveItemTitle(e.target.value)
  const updateItemTitle = (id, itemTitle) => {
    const newItems = items.map((item) => {
      return item.id === id ? { ...item, title: itemTitle } : item
    })
    setItems(newItems)
    saveToLocalStorage('exchange-items', newItems)
  }

  const updateItemValue = (id, itemValue) => {
    const newItems = items.map((item) => {
      return item.id === id ? { ...item, value: itemValue } : item
    })
    setItems(newItems)
    saveToLocalStorage('exchange-items', newItems)
  }

  const resolveContent = (item) => {
    switch (item.type) {
      case WidgetTypeOptions.HERO_CAROUSEL:
        return <HeroCarousel />
      case WidgetTypeOptions.HERO_CARD:
        return resolveHeroCardValue(item.value)
      case WidgetTypeOptions.CONTENT_MAP:
        return resolveContentMapValue(item.value)
      case WidgetTypeOptions.CONTENT_LIST:
        return resolveContentListValue(item.value)
      case WidgetTypeOptions.TEXT_SUMMARY:
        return <div>Item type: {item.type}</div>
      case WidgetTypeOptions.TEXT_BLOCK:
        return <HtmlEditor initialContent={item.value} onChange={(html) => updateItemValue(item.id, html)} />
      default:
        return null
    }
  }

  const setupItemValue = (item) => {
    setActiveItem(item)
    setActiveItemTitle(item.title)
    setDisplayItemOptions(true)
  }

  const buildItemOptions = (item) => {
    switch (item?.type) {
      case WidgetTypeOptions.CONTENT_LIST:
        return (
          <div className='flex flex-col gap-y-2 text-sm'>
            <label htmlFor='active-item-value'>
              <FormattedMessage id='landing.content.list.options' />
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
      case WidgetTypeOptions.CONTENT_MAP:
        return (
          <div className='flex flex-col gap-y-2 text-sm'>
            <label htmlFor='active-item-value'>
              <FormattedMessage id='landing.content.list.options' />
            </label>
            <Select
              id='active-item-value'
              borderless
              className='text-sm'
              options={ContentMapOptions}
              onChange={(e) => updateItemValue(item.id, e.value)}
              value={item.value}
            />
          </div>
        )
      default:
        return null
    }
  }

  const appendElement = (item) => {
    return (
      <div key={item.id}>
        <div className='flex flex-col gap-y-2'>
          {item.title &&
            <div className="text-sm font-medium">
              {item.title}
            </div>
          }
          {resolveContent(item)}
          <div className='element-actions absolute top-0 right-0' style={{ zIndex: 50 }}>
            <div className='flex flex-row gap-x-2'>
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
        </div>
      </div>
    )
  }

  const removeItem = (i) => {
    console.log('Removing item: ', i)
    const updatedItems = [...items.filter(item => item.id !== i)]
    setItems(updatedItems)
    saveToLocalStorage('exchange-items', updatedItems)
  }

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
    <div className='relative flex flex-col gap-y-6 min-h-[70vh]'>
      <div className='absolute top-2 right-2'>
        <div className='flex gap-2 text-xs text-white'>
          {Object.keys(WidgetTypeOptions).map(key => {
            return (
              <button
                key={key}
                className='bg-dial-sapphire px-3 py-2 rounded'
                onClick={() => appendItem(WidgetTypeOptions[key])}
              >
                <FormattedMessage id={WidgetTypeOptions[key]} />
              </button>
            )
          })}
        </div>
      </div>
      <div className='spacer h-4' />
      <ResponsiveReactGridLayout
        draggableCancel='.element-actions'
        className='exchange-grid-layout'
        cols={{ lg: 12, md: 6, sm: 2 }}
        breakpoints={{ lg: 1024, md: 768, sm: 640 }}
        rowHeight={32}
        layouts={layouts}
        onLayoutChange={onLayoutChange}
      >
        {items.map(item => appendElement(item))}
      </ResponsiveReactGridLayout>
      {activeItem &&
        <ItemOptionsDialog
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
  )
}

export default ConfigurableLanding
