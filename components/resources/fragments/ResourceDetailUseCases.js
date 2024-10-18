import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useApolloClient, useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import EditableSection from '../../shared/EditableSection'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { UPDATE_RESOURCE_USE_CASES } from '../../shared/mutation/resource'
import { USE_CASE_SEARCH_QUERY } from '../../shared/query/useCase'
import UseCaseCard from '../../use-case/UseCaseCard'
import { DisplayType } from '../../utils/constants'
import { fetchSelectOptionsWithMaturity } from '../../utils/search'

const ResourceDetailUseCases = ({ resource, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [useCases, setUseCases] = useState(resource.useCases)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateResourceUseCases, { loading, reset }] = useMutation(UPDATE_RESOURCE_USE_CASES, {
    onError() {
      setIsDirty(false)
      setUseCases(resource?.useCases)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.useCase.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateResourceUseCases: response } = data
      if (response?.resource && response?.errors?.length === 0) {
        setIsDirty(false)
        setUseCases(response?.resource?.useCases)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.useCase.header') }))
      } else {
        setIsDirty(false)
        setUseCases(resource?.useCases)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.useCase.header') }))
        reset()
      }
    }
  })

  const fetchedUseCasesCallback = (data) => (
    data.useCases?.map((useCase) => ({
      id: useCase.id,
      name: useCase.name,
      slug: useCase.slug,
      label: useCase.name
    }))
  )

  const addUseCase = (useCase) => {
    setUseCases([
      ...[
        ...useCases.filter(({ id }) => id !== useCase.id),
        { id: useCase.id, name: useCase.name, slug: useCase.slug  }
      ]
    ])
    setIsDirty(true)
  }

  const removeUseCase = (useCase) => {
    setUseCases([...useCases.filter(({ id }) => id !== useCase.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      updateResourceUseCases({
        variables: {
          useCaseSlugs: useCases.map(({ slug }) => slug),
          slug: resource.slug
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
    setUseCases(resource.useCases)
    setIsDirty(false)
  }

  const displayModeBody = useCases.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {useCases?.map((useCase, index) =>
        <div key={`useCase-${index}`}>
          <UseCaseCard useCase={useCase} displayType={DisplayType.SMALL_CARD} />
        </div>
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.useCase.label'),
        base: format('ui.resource.label')
      })}
    </div>

  const sectionHeader =
    <div className='font-semibold text-dial-stratos' ref={headerRef}>
      {format('ui.useCase.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('ui.useCase.label')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) =>
            fetchSelectOptionsWithMaturity(client, input, USE_CASE_SEARCH_QUERY, fetchedUseCasesCallback)
          }
          noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.useCase.label') })}
          onChange={addUseCase}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {useCases.map((useCase, useCaseIdx) => (
          <Pill
            key={`usecases-${useCaseIdx}`}
            label={useCase.name}
            onRemove={() => removeUseCase(useCase)}
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

export default ResourceDetailUseCases
