import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Dialog from '../shared/Dialog'
import Checkbox from '../shared/Checkbox'
import { SECTOR_SEARCH_QUERY } from '../../queries/sector'
import { getLanguageOptions } from '../../lib/utilities'

const labelTextBlue = 'text-dial-blue'
const labelTextGray = 'text-button-gray'

const SectorDetail = ({ sector, isOpen, onClose }) => {
  const { locale } = useRouter()
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data } = useQuery(SECTOR_SEARCH_QUERY, {
    variables: { search: '', locale }
  })

  const parentSector = data?.sectors?.find(({ id }) => id === sector?.parentSectorId?.toString())
  const sectorLocale = getLanguageOptions(format).find(({ value } ) => value === sector?.locale)

  return (
    <Dialog
      closeButton
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex flex-col gap-3' data-testid='sector-detail'>
        <div className={`${labelTextBlue} text-2xl font-bold pb-4`}>
          <p data-testid='sector-name'>{`${format('sector.label')}: ${sector.name}`}</p>
        </div>
        <div className='flex flex-col gap-3'>
          {sector?.parentSectorId && (
            <div className='text-xl'>
              <p className={labelTextBlue}>{`${format('sector.parent-sector.label')}:`}</p>
              <p className={labelTextGray} data-testid='parent-sector'>{parentSector?.name}</p>
            </div>
          )}
          <div className='text-xl'>
            <p className={labelTextBlue}>{`${format('locale.label')}:`}</p>
            <p className={labelTextGray} data-testid='sector-locale'>{sectorLocale.label}</p>
          </div>
          <div className={'flex flex-row text-xl gap-x-2'}>
            <Checkbox value={sector.isDisplayable} disabled/>
            <p className={labelTextBlue}>{format('sector.is-displayable.label')}</p>
          </div>
        </div>
      </div>  
    </Dialog>
  )
}

export default SectorDetail
