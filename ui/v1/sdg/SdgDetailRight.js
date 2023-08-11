import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { ObjectType } from '../utils/constants'
import CommentsSection from '../shared/comment/CommentsSection'

const SdgSdgTargets = ({ sdg, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='text-lg font-semibold text-dial-meadow' ref={headerRef}>
        {format('ui.sdgTarget.header')}
      </div>
      <div className='flex flex-col gap-y-3'>
        {sdg.sdgTargets.length > 0 ? (
          sdg.sdgTargets.map((sdgTarget, index) => (
            <div key={index} className='pb-5 mr-6'>
              <div className='flex flex-col lg:flex-row gap-x-3'>
                <div className='min-w-[8rem]'>
                  <img
                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdgTarget.imageFile}
                    alt={format('ui.image.logoAlt', { name:  format('ui.sdg.header') })}
                    className='object-contain w-32 h-32 mx-auto'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <div className='font-semibold text-dial-blueberry pt-1 pb-3'>
                    {`${sdg.number}. ${sdg.name}`}
                  </div>
                  <div className='text-sm font-semibold text-dial-blueberry my-auto'>
                    {`${format('ui.sdgTarget.target')} ${sdgTarget.targetNumber}`}
                  </div>
                  <div className='text-sm text-dial-stratos my-auto'>
                    {sdgTarget.name}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-sm text-dial-stratos'>
            {format('ui.common.detail.noData', {
              entity: format('ui.sdgTarget.label'),
              base: format('ui.sdg.label')
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const SdgDetailRight = forwardRef(({ sdg, commentsSectionRef }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const sdgTarget = useRef()

  useImperativeHandle(
    ref,
    () => [
      { value: 'ui.common.detail.description', ref: descRef },
      { value: 'ui.sdgTarget.header', ref: sdgTarget }
    ],
    []
  )

  return (
    <div className=' flex flex-col gap-y-4 px-4 lg:px-6 lg:py-2'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-xl font-semibold text-dial-plum py-3' ref={descRef}>
          {format('ui.common.detail.description')}
        </div>
        <div className='block'>
          {sdg.longTitle}
        </div>
      </div>
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <SdgSdgTargets sdg={sdg} headerRef={sdgTarget} />
      <hr className='bg-dial-blue-chalk mt-6 mb-3' />
      <CommentsSection
        commentsSectionRef={commentsSectionRef}
        objectId={sdg.id}
        objectType={ObjectType.SDG}
      />
    </div>
  )
})

SdgDetailRight.displayName = 'SdgDetailRight'

export default SdgDetailRight
