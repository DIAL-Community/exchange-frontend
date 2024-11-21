import { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaMinus, FaPencil, FaPlus, FaXmark } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { generateHeroCardHeaderText } from '../utilities'
import DeleteHeroCardConfiguration from './DeleteHeroCardConfiguration'
import HeroCardConfigurationEditor from './HeroCardConfigurationEditor'
import HeroCardConfigurationViewer from './HeroCardConfigurationViewer'

const HeroCardConfiguration = (props) => {
  // Common properties coming from the parent component.
  const { siteSettingSlug, heroCardConfiguration } = props
  const { heroCardConfigurations, setHeroCardConfigurations } = props

  const { name, saved } = heroCardConfiguration

  const [editing, setEditing] = useState('saved' in heroCardConfiguration)
  const [expanded, setExpanded] = useState('saved' in heroCardConfiguration)

  const [modified, setModified] = useState('saved' in heroCardConfiguration)

  const toggleEditing = () => {
    if (!editing) {
      setExpanded(true)
    }

    setEditing(!editing)
  }

  useEffect(() => {
    setModified(typeof saved !== 'undefined')
  }, [saved])

  const toggleExpanded = () => setExpanded(!expanded)
  const editable = () => ['generic-heroCard'].indexOf(heroCardConfiguration.type) >= 0

  const moveHeroCardConfiguration = (direction) => {
    // Find the index of the current heroCard configuration.
    const currentHeroCardConfigurations = [...heroCardConfigurations]

    // Index of the current configuration. This could be parent heroCard or heroCard item.
    let currentIndex = -1

    currentIndex = currentHeroCardConfigurations.findIndex(m => m.id === heroCardConfiguration.id)
    if (currentIndex >= 0) {
      const updatedIndex = currentIndex + direction
      // Only swapping if the updated index is within the range.
      if (updatedIndex >= 0 && updatedIndex <= currentHeroCardConfigurations.length) {
        const currentHeroCardConfiguration = currentHeroCardConfigurations[currentIndex]
        // Swap the current heroCard configuration with the updated index.
        currentHeroCardConfigurations[currentIndex] = currentHeroCardConfigurations[updatedIndex]
        currentHeroCardConfigurations[updatedIndex] = currentHeroCardConfiguration
      }
    }

    setHeroCardConfigurations(currentHeroCardConfigurations)
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
                ({generateHeroCardHeaderText(heroCardConfiguration)})
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
              {editable() &&
                <DeleteHeroCardConfiguration
                  siteSettingSlug={siteSettingSlug}
                  heroCardConfiguration={heroCardConfiguration}
                  heroCardConfigurations={heroCardConfigurations}
                  setHeroCardConfigurations={setHeroCardConfigurations}
                />
              }
              <div className='flex gap-1'>
                <button
                  type='button'
                  onClick={() => moveHeroCardConfiguration(-1)}
                  className='cursor-pointer bg-white px-2 py-1 rounded'
                >
                  <FaArrowUp className='my-auto text-dial-stratos' />
                </button>
                <button
                  type='button'
                  onClick={() => moveHeroCardConfiguration(1)}
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
          ? <div className='flex flex-col'>
            <HeroCardConfigurationEditor
              siteSettingSlug={siteSettingSlug}
              heroCardConfiguration={heroCardConfiguration}
              heroCardConfigurations={heroCardConfigurations}
              setHeroCardConfigurations={setHeroCardConfigurations}
            />
            <HeroCardConfigurationViewer heroCardConfiguration={heroCardConfiguration} />
          </div>
          : <HeroCardConfigurationViewer heroCardConfiguration={heroCardConfiguration} />
        }
      </div>
    </div>
  )
}

export default HeroCardConfiguration
