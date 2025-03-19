import { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react'
import classNames from 'classnames'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../lib/ToastContext'
import { SiteSettingContext, SiteSettingDispatchContext } from '../context/SiteSettingContext'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import HidableSection from '../shared/HidableSection'
import { UPDATE_SITE_SETTING_SECTION_SETTINGS } from '../shared/mutation/siteSetting'
import { ObjectType } from '../utils/constants'
import BuildingBlockDetailProducts from './fragments/BuildingBlockDetailProducts'
import BuildingBlockDetailWorkflows from './fragments/BuildingBlockDetailWorkflows'
import DeleteBuildingBlock from './fragments/DeleteBuildingBlock'

const BuildingBlockDetailRight = forwardRef(({ buildingBlock, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const productRef = useRef()
  const workflowRef = useRef()
  const commentsSectionRef = useRef()

  // Toggle whether we are editing the page or not.
  const [editingSection, setEditingSection] = useState(false)

  const { sectionConfigurations } = useContext(SiteSettingContext)
  const { setSectionConfigurations } = useContext(SiteSettingDispatchContext)

  const shouldBeDisplayed = (toggleKey) => {
    const currentSections = sectionConfigurations[ObjectType.BUILDING_BLOCK] ?? []

    return editingAllowed || currentSections.indexOf(toggleKey) === -1
  }

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)
  const [saveItemSettings, { reset }] = useMutation(UPDATE_SITE_SETTING_SECTION_SETTINGS, {
    onCompleted: (data) => {
      const { updateSiteSettingSectionSettings: response } = data
      if (response.siteSetting && response?.errors?.length === 0) {
        setSectionConfigurations(response.siteSetting.sectionConfigurations)
        showSuccessMessage(<FormattedMessage id='ui.section.save.success' />)
      } else {
        showFailureMessage(<FormattedMessage id='ui.section.save.failure' />)
      }
    },
    onError: () => {
      showFailureMessage(<FormattedMessage id='ui.section.save.failure' />)
      reset()
    }
  })

  // Toggle the editing context for the current page.
  const toggleEditing = () => {
    // Toggle the editing flag for the current page.
    setEditingSection(!editingSection)
    // Save the changes to the database.
    if (editingSection) {
      saveItemSettings({
        variables: {
          sectionConfigurations
        }
      })
    }
  }

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.product.header', ref: productRef },
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  return (
    <div className='px-4 lg:px-0 py-4 lg:py-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 ml-auto'>
          {editingAllowed && (
            <button
              type='button'
              onClick={toggleEditing}
              className={classNames(
                'cursor-pointer bg-dial-iris-blue px-2 py-1 rounded text-white',
                editingSection ? 'opacity-100' : 'opacity-50 hover:opacity-100'
              )}
            >
              <FiEdit3 className='inline pb-0.5' />
              <span className='text-sm px-1'>
                {editingSection
                  ? <FormattedMessage id='ui.section.save' />
                  : <FormattedMessage id='ui.section.edit' />
                }
              </span>
            </button>
          )}
          { !buildingBlock.markdownUrl && editingAllowed &&
            <EditButton type='link' href={`/building-blocks/${buildingBlock.slug}/edit`} />
          }
          { deletingAllowed && <DeleteBuildingBlock buildingBlock={buildingBlock} /> }
        </div>
        {shouldBeDisplayed('description') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex items-center py-3'>
              <div className='text-xl font-semibold text-dial-ochre py-3' ref={descRef}>
                {format('ui.common.detail.description')}
              </div>
              <div className='ml-auto'>
                <HidableSection
                  objectKey='description'
                  objectType={ObjectType.BUILDING_BLOCK}
                  disabled={!editingSection}
                  displayed={editingAllowed}
                />
              </div>
            </div>
            <div className='description-block'>
              <HtmlViewer
                initialContent={buildingBlock?.buildingBlockDescription?.description}
                editorId='buildingBlock-description'
              />
            </div>
          </div>
        )}
        {shouldBeDisplayed('products') && (
          <div className='flex flex-col gap-y-3'>
            <hr className='border-b border-dial-blue-chalk my-3' />
            <BuildingBlockDetailProducts
              buildingBlock={buildingBlock}
              editingSection={editingSection}
              editingAllowed={!buildingBlock.markdownUrl && editingAllowed}
              headerRef={productRef}
            />
          </div>
        )}
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='flex flex-col gap-y-3'>
          <BuildingBlockDetailWorkflows
            buildingBlock={buildingBlock}
            editingAllowed={!buildingBlock.markdownUrl && editingAllowed}
            headerRef={workflowRef}
          />
        </div>
        <hr className='border-b border-dial-blue-chalk my-3' />
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={buildingBlock} objectType={ObjectType.BUILDING_BLOCK} />
          <hr className='border-b border-dial-slate-200'/>
          <Share />
          <hr className='border-b border-dial-slate-200'/>
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={buildingBlock.id}
          objectType={ObjectType.BUILDING_BLOCK}
        />
      </div>
    </div>
  )
})

BuildingBlockDetailRight.displayName = 'BuildingBlockDetailRight'

export default BuildingBlockDetailRight
