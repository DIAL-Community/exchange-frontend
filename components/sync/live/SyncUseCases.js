import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'
import Pill from '../../shared/form/Pill'
import Select from '../../shared/form/Select'
import { USE_CASE_SEARCH_QUERY } from '../../shared/query/useCase'
import { fetchSelectOptionsWithMaturity } from '../../utils/search'

const SyncUseCases = ({ useCases, setUseCases }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const fetchUseCasesCallback = (data) => (
    data.useCases?.map((useCase) => ({
      id: useCase.id,
      name: useCase.name,
      slug: useCase.slug,
      label: useCase.name
    }))
  )

  const removeUseCase = (useCase) => {
    setUseCases([...useCases.filter(({ id }) => id !== useCase.id)])
  }

  const addUseCase = (useCase) => {
    setUseCases([
      ...[
        ...useCases.filter(({ id }) => id !== useCase.id),
        { id: useCase.id, name: useCase.name, slug: useCase.slug }
      ]
    ])
  }

  return (

    <div className='flex flex-col'>
      <ul className="flex flex-wrap gap-x-4 -mb-px">
        <li className="me-2">
          <div href='#' className='inline-block py-3 border-b-2 border-dial-sunshine'>
            {format('ui.useCase.header')}
          </div>
        </li>
      </ul>
      <div className='flex flex-col gap-y-3 border px-6 py-4'>
        <label className='flex flex-col gap-y-2'>
          {`${format('ui.syncTenant.searchFor')} ${format('ui.useCase.label')}`}
          <Select
            async
            isSearch
            isBorderless
            defaultOptions
            cacheOptions
            placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
            loadOptions={(input) =>
              fetchSelectOptionsWithMaturity(client, input, USE_CASE_SEARCH_QUERY, fetchUseCasesCallback)
            }
            noOptionsMessage={() => format('ui.syncTenant.searchFor', { entity: format('ui.useCase.label') })}
            onChange={addUseCase}
            value={null}
          />
        </label>
        <div className='flex flex-wrap gap-3'>
          {useCases.map((useCase, useCaseIdx) => (
            <Pill
              key={`author-${useCaseIdx}`}
              label={useCase.name}
              onRemove={() => removeUseCase(useCase)}
            />
          ))}
        </div>
      </div>
    </div>
  )

}

export default SyncUseCases
