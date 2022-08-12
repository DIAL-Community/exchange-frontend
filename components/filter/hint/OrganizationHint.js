import { useContext } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import Image from 'next/image'
import { FilterContext } from '../../context/FilterContext'

const OrganizationHint = () => {
  const { setHintDisplayed } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  return (
    <>
      <div className='grid grid-cols-11 gap-4 pb-4 pt-8 text-dial-gray-dark'>
        <div className='col-span-11'>
          <div className='text-sm flex flex-col'>
            <div className='text-xl font-semibold px-8 pb-3'>
              {format('organization.label')}
            </div>
            <div className='text-base px-8'>
              {format('organization.hint.subtitle')}
            </div>
            <div className='ml-20'>
              <Image
                height={200}
                width={200}
                src='/images/tiles/organization.svg'
                alt='' />
            </div>
          </div>
        </div>
        <div className='col-span-11'>
          <div className='text-lg px-8 pb-3'>
            {format('organization.hint.characteristicTitle').toUpperCase()}
          </div>
          <div className='fr-view text-sm px-8 pb-3'>
            {format('organization.hint.characteristics')}
          </div>
          <div className='text-lg px-8 pb-3'>
            {format('organization.hint.descriptionTitle').toUpperCase()}
          </div>
          <div className='fr-view text-sm px-8 pb-3'>
            {parse(format('organization.hint.description'))}
          </div>
        </div>
        <div className='absolute right-2 top-2'>
          <a
            className='cursor-pointer bg-button-gray p-3 float-right rounded text-button-gray-light'
            onClick={() => setHintDisplayed(false)}
          >
            {format('general.close')}
          </a>
        </div>
      </div>
    </>
  )
}

export default OrganizationHint
