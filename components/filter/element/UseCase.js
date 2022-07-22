import { useApolloClient } from '@apollo/client'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { USE_CASE_SEARCH_QUERY } from '../../../queries/use-case'
import { fetchSelectOptionsWithMature } from '../../../queries/utils'
import Select from '../../shared/Select'
import Pill from '../../shared/Pill'

export const UseCaseAutocomplete = ({
  useCases,
  setUseCases,
  containerStyles = null,
  controlSize = null,
  placeholder = null,
  isSearch = false
}) => {
  const client = useApolloClient()

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const controlPlaceholder = placeholder ?? format('filter.byEntity', { entity: format('useCase.label') })

  const selectUseCase = (useCase) => {
    setUseCases([...useCases.filter(({ slug }) => slug !== useCase.slug), useCase])
  }

  const fetchedUseCasesCallback = (data) => (
    data?.useCases.map((useCase) => ({
      label: useCase.name,
      value: useCase.id,
      slug: useCase.slug
    }))
  )

  return (
    <div className={classNames(containerStyles)} data-testid='use-case-search'>
      <Select
        async
        aria-label={format('filter.byEntity', { entity: format('useCase.label') })}
        cacheOptions
        defaultOptions
        loadOptions={(input) => fetchSelectOptionsWithMature(client, input, USE_CASE_SEARCH_QUERY, fetchedUseCasesCallback)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('useCase.header') })}
        onChange={selectUseCase}
        placeholder={controlPlaceholder}
        value=''
        controlSize={controlSize}
        isSearch={isSearch}
      />
    </div>
  )
}

export const UseCaseFilters = (props) => {
  const { useCases, setUseCases } = props

  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const removeUseCase = (useCaseId) => {
    setUseCases(useCases.filter(({ slug }) => slug !== useCaseId))
  }

  return (
    <>
      {useCases?.map((useCases, useCasesIdx) => (
        <div className='py-1' key={useCasesIdx}>
          <Pill
            key={`filter-${useCasesIdx}`}
            label={`${format('useCase.label')}: ${useCases.label}`}
            onRemove={() => removeUseCase(useCases.slug)}
          />
        </div>
      ))}
    </>
  )
}
