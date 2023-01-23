import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import PlaybookCard from '../playbooks/PlaybookCard'
import EditableSection from '../shared/EditableSection'

const ProductDetailPlaybooks = ({ product }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id) => formatMessage({ id }), [formatMessage])

  const displayModeBody = (
    <div className='grid grid-cols-1'>
      {product.playbooks.map(
        (playbook, playbookIdx) =>
          <PlaybookCard key={playbookIdx} playbook={playbook} listType='list' filterDisplayed newTab/>)
      }
    </div>
  )

  return (
    <EditableSection
      sectionHeader={format('playbook.header')}
      displayModeBody={displayModeBody}
    />
  )
}

export default ProductDetailPlaybooks
