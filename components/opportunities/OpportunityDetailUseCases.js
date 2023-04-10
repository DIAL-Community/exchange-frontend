import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_OPPORTUNITY_USE_CASES } from '../../mutations/opportunity'
import { USE_CASE_SEARCH_QUERY } from '../../queries/use-case'
import { fetchSelectOptionsWithMature } from '../../queries/utils'
import UseCaseCard from '../use-cases/UseCaseCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const OpportunityDetailUseCases = ({ opportunity, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const { user } = useUser()
  const { locale } = useRouter()
  const { showToast } = useContext(ToastContext)

  const [isDirty, setIsDirty] = useState(false)
  const [useCases, setUseCases] = useState(opportunity.useCases)

  const [updateOpportunityUseCases, { data, loading, reset }] = useMutation(
    UPDATE_OPPORTUNITY_USE_CASES, {
      onCompleted: (data) => {
        const { updateOpportunityUseCases: response } = data
        if (response?.opportunity && response?.errors?.length === 0) {
          setIsDirty(false)
          setUseCases(response?.opportunity?.useCases)
          showToast(format('toast.useCases.update.success'), 'success', 'top-center')
        } else {
          setIsDirty(false)
          setUseCases(opportunity.useCases)
          showToast(format('toast.useCases.update.failure'), 'error', 'top-center')
          reset()
        }
      },
      onError: () => {
        setIsDirty(false)
        setUseCases(opportunity.useCases)
        showToast(format('toast.useCases.update.failure'), 'error', 'top-center')
        reset()
      }
    }
  )

  const fetchedUseCasesCallback = (data) => (
    data.useCases.map((useCase) => ({
      label: useCase.name,
      value: useCase.id,
      slug: useCase.slug
    }))
  )

  const addUseCase = (useCase) => {
    setUseCases([
      ...useCases.filter(({ slug }) => slug !== useCase.slug),
      { name: useCase.label, slug: useCase.slug }
    ])
    setIsDirty(true)
  }

  const removeUseCase = (useCase) => {
    setUseCases([...useCases.filter(({ slug }) => slug !== useCase.slug)])
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
    setUseCases(data?.updateOpportunityUseCases?.opportunity?.useCases ?? opportunity.useCases)
    setIsDirty(false)
  }

  const displayModeBody =
    <>
      {useCases.length > 0 ? (
        <div className='grid grid-cols-1'>
          {useCases.map((useCase, useCaseIdx) =>
            <UseCaseCard key={useCaseIdx} useCase={useCase} listType='list' />
          )}
        </div>
      ) : (
        <div className='text-sm pb-5 text-button-gray'>
          {format('opportunity.no-use-case')}
        </div>
      )}
    </>

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('use-case.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='use-case-search'>
        {`${format('app.searchAndAssign')} ${format('use-case.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={
            (input) =>
              fetchSelectOptionsWithMature(
                client,
                input,
                USE_CASE_SEARCH_QUERY,
                fetchedUseCasesCallback
              )
          }
          noOptionsMessage={() =>
            format('filter.searchFor', { entity: format('use-case.header') })
          }
          onChange={addUseCase}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {useCases.map((useCase, useCaseIdx) => (
          <Pill
            key={`useCase-${useCaseIdx}`}
            label={useCase.name}
            onRemove={() => removeUseCase(useCase)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('use-case.header')}
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
