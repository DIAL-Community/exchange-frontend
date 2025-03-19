import { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'
import { FiEdit3 } from 'react-icons/fi'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../lib/ToastContext'
import { SiteSettingContext, SiteSettingDispatchContext } from '../context/SiteSettingContext'
import CommentsSection from '../shared/comment/CommentsSection'
import Bookmark from '../shared/common/Bookmark'
import Share from '../shared/common/Share'
import CreateButton from '../shared/form/CreateButton'
import EditButton from '../shared/form/EditButton'
import { HtmlViewer } from '../shared/form/HtmlViewer'
import HidableSection from '../shared/HidableSection'
import { UPDATE_SITE_SETTING_SECTION_SETTINGS } from '../shared/mutation/siteSetting'
import { DisplayType, ObjectType } from '../utils/constants'
import WorkflowCard from '../workflow/WorkflowCard'
import UseCaseBuildingBlockRenderer from './custom/BuildingBlockRenderer'
import DeleteUseCase from './fragments/DeleteUseCase'
import UseCaseDetailSdgTargets from './fragments/UseCaseDetailSdgTargets'
import UseCaseDetailTags from './fragments/UseCaseDetailTags'

const UseCaseDetailRight = forwardRef(({ useCase, editingAllowed, deletingAllowed }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const stepRef = useRef()
  const workflowRef = useRef()
  const sdgTargetRef = useRef()
  const buildingBlockRef = useRef()
  const tagRef = useRef()
  const commentsSectionRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.common.detail.description', ref: descRef },
    { value: 'ui.useCase.detail.steps', ref: stepRef },
    { value: 'ui.workflow.header', ref: workflowRef },
    { value: 'ui.sdgTarget.header', ref: sdgTargetRef },
    { value: 'ui.buildingBlock.header', ref: buildingBlockRef },
    { value: 'ui.tag.header', ref: tagRef },
    { value: 'ui.comment.label', ref: commentsSectionRef }
  ]), [])

  // Toggle whether we are editing the page or not.
  const [editingSection, setEditingSection] = useState(false)

  const { sectionConfigurations } = useContext(SiteSettingContext)
  const { setSectionConfigurations } = useContext(SiteSettingDispatchContext)

  const shouldBeDisplayed = (toggleKey) => {
    const currentSections = sectionConfigurations[ObjectType.USE_CASE] ?? []

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

  const editPath = `${useCase.slug}/edit`

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
          {!useCase.markdownUrl && editingAllowed && <EditButton type='link' href={editPath} />}
          {deletingAllowed && <DeleteUseCase useCase={useCase} />}
        </div>
        {shouldBeDisplayed('description') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex items-center py-3'>
              <div className='text-xl font-semibold text-dial-blueberry py-3' ref={descRef}>
                {format('ui.common.detail.description')}
              </div>
              <HidableSection
                objectKey='description'
                objectType={ObjectType.USE_CASE}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
            </div>
            <div className='use-case-description-block'>
              <HtmlViewer
                initialContent={useCase?.useCaseDescription?.description}
                editorId='use-case-description'
              />
            </div>
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('useCaseSteps') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex flex-row gap-3 pb-3' ref={stepRef}>
              <div className='text-xl font-semibold text-dial-blueberry '>
                {format('ui.useCase.detail.steps')}
              </div>
              {editingAllowed &&
                <HidableSection
                  objectKey='useCaseSteps'
                  objectType={ObjectType.USE_CASE}
                  disabled={!editingSection}
                  displayed={editingAllowed}
                />
              }
              {!useCase.markdownUrl && editingAllowed &&
                <CreateButton
                  type='link'
                  label={format('app.create')}
                  href={
                    `/use-cases/${useCase.slug}` +
                    '/use-case-steps/create'
                  }
                />
              }
            </div>
            <div className='text-xs text-justify italic text-dial-stratos mb-2'>
              {format('ui.useCase.overview.useCaseStep')}
            </div>
            <div className='flex flex-col gap-y-3'>
              {useCase?.useCaseSteps?.map((useCaseStep, index) =>
                <Link
                  key={index}
                  href={
                    `/use-cases/${useCase.slug}` +
                    `/use-case-steps/${useCaseStep.slug}`
                  }
                >
                  <div className='rounded-md bg-dial-cotton flex'>
                    <div className='flex flex-col gap-y-3 text-dial-blueberry px-6 py-4'>
                      <div className='text-base'>
                        {`${index + 1}. ${useCaseStep.name}`}
                      </div>
                      <div className='flex flex-col lg:flex-row gap-2 text-xs text-dial-stratos'>
                        <div className='text-sm'>
                          {format('ui.workflow.header')} ({useCaseStep.workflows?.length ?? 0})
                        </div>
                        <div className='border border-r border-dial-slate-300' />
                        <div className='text-sm'>
                          {format('ui.buildingBlock.header')} ({useCaseStep.buildingBlocks?.length ?? 0})
                        </div>
                        <div className='border border-r border-dial-slate-300' />
                        <div className='text-sm'>
                          {format('ui.product.header')} ({useCaseStep.products?.length ?? 0})
                        </div>
                      </div>
                    </div>
                    <FaArrowRight className='ml-auto mr-3 my-auto' />
                  </div>
                </Link>
              )}
            </div>
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('workflows') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex items-center pb-3'>
              <div className='text-xl font-semibold text-dial-blueberry' ref={workflowRef}>
                {format('ui.workflow.header')}
              </div>
              <HidableSection
                objectKey='workflows'
                objectType={ObjectType.USE_CASE}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
            </div>
            {useCase?.workflows.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.workflow.label'),
                  base: format('ui.useCase.label')
                })}
              </div>
            }
            {useCase?.workflows.length > 0 &&
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
                {useCase?.workflows?.map((workflow, index) =>
                  <div key={`workflow-${index}`}>
                    <WorkflowCard
                      index={index}
                      workflow={workflow}
                      displayType={DisplayType.SMALL_CARD}
                    />
                  </div>
                )}
              </div>
            }
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('sdgTargets') && (
          <div className='flex flex-col gap-y-3'>
            <UseCaseDetailSdgTargets
              useCase={useCase}
              editingSection={editingSection}
              editingAllowed={!useCase.markdownUrl && editingAllowed}
              headerRef={sdgTargetRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('buildingBlocks') && (
          <div className='flex flex-col gap-y-3'>
            <div className='flex items-center pb-3'>
              <div className='text-xl font-semibold text-dial-blueberry' ref={buildingBlockRef}>
                {format('ui.buildingBlock.header')}
              </div>
              <HidableSection
                objectKey='buildingBlocks'
                objectType={ObjectType.USE_CASE}
                disabled={!editingSection}
                displayed={editingAllowed}
              />
            </div>
            <div className='text-xs text-justify italic text-dial-stratos mb-2'>
              {format('ui.useCase.overview.buildingBlock')}
            </div>
            {useCase?.buildingBlocks?.length <= 0 &&
              <div className='text-sm text-dial-stratos'>
                {format('ui.common.detail.noData', {
                  entity: format('ui.buildingBlock.label'),
                  base: format('ui.useCase.label')
                })}
              </div>
            }
            {useCase?.buildingBlocks?.length > 0 &&
              <UseCaseBuildingBlockRenderer useCaseBuildingBlocks={useCase.buildingBlocks} />
            }
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        {shouldBeDisplayed('tags') && (
          <div className='flex flex-col gap-y-3'>
            <UseCaseDetailTags
              useCase={useCase}
              editingSection={editingSection}
              editingAllowed={!useCase.markdownUrl && editingAllowed}
              headerRef={tagRef}
            />
            <hr className='border-b border-dial-blue-chalk my-3' />
          </div>
        )}
        <div className='lg:hidden flex flex-col gap-y-3'>
          <Bookmark object={useCase} objectType={ObjectType.USE_CASE} />
          <hr className='border-b border-dial-slate-200' />
          <Share />
          <hr className='border-b border-dial-slate-200' />
        </div>
        <CommentsSection
          commentsSectionRef={commentsSectionRef}
          objectId={useCase.id}
          objectType={ObjectType.USE_CASE}
        />
      </div>
    </div>
  )
})

UseCaseDetailRight.displayName = 'UseCaseDetailRight'

export default UseCaseDetailRight
