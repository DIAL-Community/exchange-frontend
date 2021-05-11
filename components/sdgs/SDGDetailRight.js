import { FormattedDate, useIntl } from 'react-intl'
import Breadcrumb from '../shared/breadcrumb'
import ReactHtmlParser from 'react-html-parser'

const SDGDetailRight = ({ sdg }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  return (
    <div className=''>
      <Breadcrumb />
    </div>
  )
}

export default SDGDetailRight
