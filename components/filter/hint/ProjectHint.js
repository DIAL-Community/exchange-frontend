import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'

const ProjectHint = (props) => {
  const { openHint, setOpenHint } = props

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  
  return (
    <>
      <div className='grid grid-cols-11 gap-4 pb-4 pt-8'>
        <div className='col-span-11 md:col-span-4 lg:col-span-3 border-transparent border-r lg:border-dial-purple-light'>
          <div className='text-sm text-dial-gray-light flex flex-col'>
            <div className='text-white text-xl font-semibold px-8 pb-3'>
              {format('project.label')}
            </div>
            <div className='text-white text-base px-8'>
              {format('project.hint.subtitle')}
            </div>
            <img className='w-48 h-48 mt-8 mx-auto xl:mt-0' src='images/tiles/project.svg' alt='' />
          </div>
        </div>
        <div className='col-span-11 md:col-span-6 lg:col-span-7'>
          <div className='text-white text-lg px-8 pb-3'>
            {format('project.hint.characteristicTitle').toUpperCase()}
          </div>
          <div className='fr-view text-white text-sm px-8 pb-3'>
            {ReactHtmlParser(format('project.hint.characteristics'))}
          </div>
          <div className='text-white text-lg px-8 pb-3'>
            {format('project.hint.descriptionTitle').toUpperCase()}
          </div>
          <div className='text-white text-sm px-8 pb-3'>
            {format('project.hint.description')}
          </div>
        </div>
        <div className="absolute right-2 top-2">
          <button className="bg-button-gray p-4 float-right rounded text-button-gray-light" onClick={() => setOpenHint(!openHint)}>
            <img src="/icons/close.svg" class="inline mr-2" alt="Close" height="20px" width="20px" />
            {format('general.close')}
          </button>
        </div>
      </div>
    </>
  )
}

export default ProjectHint
