import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import Select from '../../shared/form/Select'
import { fetchSelectOptionsWithMaturity } from '../../utils/search'
import Pill from '../../shared/form/Pill'
import EditableSection from '../../shared/EditableSection'
import { UPDATE_OPPORTUNITY_USE_CASES } from '../../shared/mutation/opportunity'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import { USE_CASE_SEARCH_QUERY } from '../../shared/query/useCase'
import UseCaseCard from '../../use-case/UseCaseCard'
import { DisplayType } from '../../utils/constants'

const OpportunityDetailUseCases = ({ opportunity, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [useCases, setUseCases] = useState(opportunity.useCases)
  const [isDirty, setIsDirty] = useState(false)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateOpportunityUseCases, { loading, reset }] = useMutation(UPDATE_OPPORTUNITY_USE_CASES, {
    onError: () => {
      setIsDirty(false)
      setUseCases(opportunity.useCases)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.useCase.header') }))
    },
    onCompleted: (data) => {
      const { updateOpportunityUseCases: response } = data
      if (response?.opportunity && response?.errors?.length === 0) {
        setIsDirty(false)
        setUseCases(response?.opportunity?.useCases)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.useCase.header') }))
      } else {
        setIsDirty(false)
        setUseCases(opportunity.useCases)
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
      const { userEmail, userToken } = user

      updateOpportunityUseCases({
        variables: {
          slug: opportunity.slug,
          useCaseSlugs: useCases.map(({ slug }) => slug)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setUseCases(opportunity.useCases)
    setIsDirty(false)
  }

  const sectionHeader =
    <div className='text-xl font-semibold text-dial-plum' ref={headerRef}>
      {format('ui.useCase.header')}
    </div>

  const displayModeBody = useCases.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {useCases?.map((useCase, index) =>
        <UseCaseCard
          key={index}
          useCase={useCase}
          displayType={DisplayType.SMALL_CARD}
        />
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format('ui.common.detail.noData', {
        entity: format('ui.useCase.label'),
        base: format('ui.opportunity.label')
      })}
    </div>

  const loadOptions = (input) =>
    fetchSelectOptionsWithMaturity(client, input, USE_CASE_SEARCH_QUERY, fetchedUseCasesCallback)

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>
      <label className='flex flex-col gap-y-2'>
        {`${format('app.searchAndAssign')} ${format('useCase.header')}`}
        <Select
          async
          isSearch
          isBorderless
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={loadOptions}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('useCase.header') })}
          onChange={addUseCase}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3'>
        {useCases.map((useCase, useCaseIdx) => (
          <Pill
            key={`useCase-${useCaseIdx}`}
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

export default OpportunityDetailUseCases
