import { useState } from 'react'
import { FaArrowDown, FaArrowUp, FaMinus, FaPencil, FaPlus, FaXmark } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { generateCarouselHeaderText } from '../utilities'
import CarouselConfigurationEditor from './CarouselConfigurationEditor'
import CarouselConfigurationViewer from './CarouselConfigurationViewer'
import DeleteCarouselConfiguration from './DeleteCarouselConfiguration'

const CarouselConfiguration = (props) => {
  // Common properties coming from the parent component.
  const { siteSettingSlug, carouselConfiguration } = props
  const { carouselConfigurations, setCarouselConfigurations } = props

  const { name, saved } = carouselConfiguration

  const [editing, setEditing] = useState('saved' in carouselConfiguration)
  const [expanded, setExpanded] = useState('saved' in carouselConfiguration)

  const modified = typeof saved === 'undefined' || 'saved' in carouselConfiguration

  const toggleEditing = () => {
    if (!editing) {
      setExpanded(true)
    }

    setEditing(!editing)
  }

  const toggleExpanded = () => setExpanded(!expanded)
  const editable = () => ['generic-carousel'].indexOf(carouselConfiguration.type) >= 0

  const moveCarouselConfiguration = (direction) => {
    // Find the index of the current carousel configuration.
    const currentCarouselConfigurations = [...carouselConfigurations]

    // Index of the current configuration. This could be parent carousel or carousel item.
    let currentIndex = -1

    currentIndex = currentCarouselConfigurations.findIndex(m => m.id === carouselConfiguration.id)
    if (currentIndex >= 0) {
      const updatedIndex = currentIndex + direction
      // Only swapping if the updated index is within the range.
      if (updatedIndex >= 0 && updatedIndex <= currentCarouselConfigurations.length) {
        const currentCarouselConfiguration = currentCarouselConfigurations[currentIndex]
        // Swap the current carousel configuration with the updated index.
        currentCarouselConfigurations[currentIndex] = currentCarouselConfigurations[updatedIndex]
        currentCarouselConfigurations[updatedIndex] = currentCarouselConfiguration
      }
    }

    setCarouselConfigurations(currentCarouselConfigurations)
  }

  return (
    <div className='flex flex-col'>
      <div className='collapse-header'>
        <div className='collapse-animation-base bg-dial-blue-chalk h-14' />
        <div className='flex flex-row flex-wrap gap-3 collapse-header'>
          <div className='my-auto cursor-pointer flex-grow' onClick={toggleExpanded}>
            <div className='font-semibold px-4 py-4 flex gap-1'>
              {name}
              <span className='text-xs font-normal my-auto'>
                ({generateCarouselHeaderText(carouselConfiguration)})
              </span>
              {modified && <span className='text-sm text-dial-stratos'>*</span>}
            </div>
          </div>
          <div className='ml-auto my-auto px-4'>
            <div className='flex gap-2'>
              {editable() &&
                <button
                  type='button'
                  onClick={toggleEditing}
                  className='bg-white px-2 py-1 rounded'
                >
                  <div className='text-sm flex gap-1 text-dial-stratos'>
                    {!editing ? <FaPencil className='my-auto' /> : <FaXmark className='my-auto' />}
                    {!editing ? <FormattedMessage id='app.modify' /> : <FormattedMessage id='app.cancel' />}
                  </div>
                </button>
              }
              <DeleteCarouselConfiguration
                siteSettingSlug={siteSettingSlug}
                carouselConfiguration={carouselConfiguration}
                carouselConfigurations={carouselConfigurations}
                setCarouselConfigurations={setCarouselConfigurations}
              />
              <div className='flex gap-1'>
                <button
                  type='button'
                  onClick={() => moveCarouselConfiguration(-1)}
                  className='cursor-pointer bg-white px-2 py-1 rounded'
                >
                  <FaArrowUp className='my-auto text-dial-stratos' />
                </button>
                <button
                  type='button'
                  onClick={() => moveCarouselConfiguration(1)}
                  className='cursor-pointer bg-white px-2 py-1 rounded'
                >
                  <FaArrowDown className='my-auto text-dial-stratos' />
                </button>
              </div>
              <button
                type='button'
                onClick={toggleExpanded}
                className='cursor-pointer bg-white px-2 py-1 rounded'
              >
                {expanded
                  ? <FaMinus className='my-auto text-dial-stratos' />
                  : <FaPlus className='my-auto text-dial-stratos' />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${expanded ? 'slide-down' : 'slide-up'} border`}>
        {editing
          ? <div className='flex flex-col gap-4'>
            <CarouselConfigurationEditor
              siteSettingSlug={siteSettingSlug}
              carouselConfiguration={carouselConfiguration}
              carouselConfigurations={carouselConfigurations}
              setCarouselConfigurations={setCarouselConfigurations}
            />
            <div className='border border-dashed' />
            <CarouselConfigurationViewer carouselConfiguration={carouselConfiguration} />
          </div>
          : <CarouselConfigurationViewer carouselConfiguration={carouselConfiguration} />
        }
      </div>
    </div>
  )
}

export default CarouselConfiguration
