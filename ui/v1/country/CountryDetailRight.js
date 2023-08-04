import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType, REBRAND_BASE_PATH } from '../utils/constants'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import { useUser } from '../../../lib/hooks'
import CommentsSection from '../shared/comment/CommentsSection'
import DeleteCountry from './DeleteCountry'

const CountryDetailRight = forwardRef(({ country, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { isAdminUser, isEditorUser } = useUser()
  const canEdit = (isAdminUser || isEditorUser) && !country.markdownUrl

  const descRef = useRef()
  const pricingRef = useRef()
  const sdgRef = useRef()
  const buildingBlockRef = useRef()
  const countryRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.country.pricing.title', ref: pricingRef },
      { value: 'ui.sdg.header', ref: sdgRef },
      { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
      { value: 'ui.country.header', ref: countryRef },
      { value: 'ui.tag.header', ref: tagRef }
    ],
    []
  )

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        {canEdit && (
          <div className='flex gap-x-3 ml-auto'>
            <EditButton type='link' href={`${REBRAND_BASE_PATH}/countries/${country.slug}/edit`} />
            {isAdminUser && <DeleteCountry country={country} />}
          </div>
        )}
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={country?.countryDescription?.description}
            editorId='country-description'
          />
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={country.id}
        objectType={ObjectType.COUNTRY}
      />
    </div>
  )
})

CountryDetailRight.displayName = 'CountryDetailRight'

export default CountryDetailRight
