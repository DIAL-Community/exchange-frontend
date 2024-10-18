import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import SdgCard from '../../sdg/SdgCard'
import { DisplayType } from '../../utils/constants'
import Select from '../../shared/form/Select'
import { fetchSelectOptions } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { UPDATE_PROJECT_SDGS } from '../../shared/mutation/project'
import { SDG_SEARCH_QUERY } from '../../shared/query/sdg'

const ProjectDetailSdgs = ({ project, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [sdgs, setSdgs] = useState(project.sdgs)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProjectSdgs, { loading, reset }] = useMutation(UPDATE_PROJECT_SDGS, {
    onError() {
      setIsDirty(false)
      setSdgs(project?.sdgs)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.sdg.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProjectSdgs: response } = data
      if (response?.project && response?.errors?.length === 0) {
        setIsDirty(false)
        setSdgs(response?.project?.sdgs)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.sdg.header') }))
      } else {
        setIsDirty(false)
        setSdgs(project?.sdgs)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.sdg.header') }))
        reset()
      }
    }
  })

  const fetchedSdgsCallback = (data) => (
    data.sdgs?.map((sdg) => ({
      id: sdg.id,
      name: sdg.name,
      label: `${sdg.number}. ${sdg.name}`,
      slug: sdg.slug,
      number: sdg.number
    }))
  )

  const addSdg = (sdg) => {
    setSdgs([
      ...[
        ...sdgs.filter(({ id }) => id !== sdg.id), {
          id: sdg.id,
          name: sdg.name,
          slug: sdg.slug,
          number: sdg.number
        }
      ].sort((a, b) => {
        const diff = parseInt(a.number) - parseInt(b.number)

        return diff === 0 ? a.number.localeCompare(b.number) : diff
      })
    ])
    setIsDirty(true)
  }

  const removeSdg = (sdg) => {
    setSdgs([...sdgs.filter(({ id }) => id !== sdg.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      updateProjectSdgs({
        variables: {
          slug: project.slug,
          sdgSlugs: sdgs.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale
          }
        }
      })
    }
  }

  const onCancel = () => {
    setSdgs(project.sdgs)
    setIsDirty(false)
  }

  const displayModeBody = sdgs.length
    ? sdgs?.map((sdg, index) =>
      <SdgCard key={index} sdg={sdg} displayType={DisplayType.SMALL_CARD} />
    )
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', {
        entity: format('ui.sdg.label'),
        base: format('ui.project.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.sdg.longHeader')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.sdg.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptions(client, input, SDG_SEARCH_QUERY, fetchedSdgsCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('sdg.label') })}
          onChange={addSdg}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {sdgs.map((sdg, sdgIdx) => (
          <Pill
            key={`sdgs-${sdgIdx}`}
            label={`${sdg.number}. ${sdg.name}`}
            onRemove={() => removeSdg(sdg)}
          />
        ))}
      </div>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProjectDetailSdgs
