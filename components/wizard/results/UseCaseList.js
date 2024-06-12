import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import Pagination from '../../shared/Pagination'
import { WIZARD_USE_CASES_QUERY } from '../../shared/query/wizard'
import UseCaseCard from '../../use-case/UseCaseCard'
import { DisplayType } from '../../utils/constants'
import { WizardContext } from '../WizardContext'

const UseCaseList = ({ headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const DEFAULT_PAGE_SIZE = 5
  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const handlePageClick = (event) => {
    setPageNumber(event.selected)
    setPageOffset(event.selected * DEFAULT_PAGE_SIZE)
  }

  const { sdgs, sectors, useCases: inputUseCases } = useContext(WizardContext)

  const { loading, error, data } = useQuery(WIZARD_USE_CASES_QUERY, {
    variables: {
      sdgs: sdgs.map(sdg => sdg.value),
      sectors,
      useCases: inputUseCases.map(useCase => useCase.value),
      limit: DEFAULT_PAGE_SIZE,
      offset: pageOffset
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedWizardUseCases && !data?.paginationWizardAttributeUseCase) {
    return <NotFound />
  }

  const {
    paginatedWizardUseCases: useCases,
    paginationWizardAttributeUseCase: paginationAttribute
  } = data

  return (
    <div className='flex flex-col gap-y-4' ref={headerRef}>
      <div className='flex flex-col gap-y-2'>
        <div className='text-xl font-semibold text-dial-blueberry'>
          {format('ui.useCase.header')}
        </div>
        <div className='text-xs italic'>
          {format('ui.wizard.useCase.description')}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {useCases.map((useCase, index) =>
          <UseCaseCard
            key={index}
            index={index}
            useCase={useCase}
            displayType={DisplayType.SMALL_CARD}
          />
        )}
      </div>
      <Pagination
        pageNumber={pageNumber}
        totalCount={paginationAttribute.totalCount}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        onClickHandler={handlePageClick}
      />
    </div>
  )
}

export default UseCaseList
