import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { CONTACT_DETAIL_QUERY } from '../shared/query/contact'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import ContactForm from './fragments/ContactForm'
import ContactEditLeft from './ContactEditLeft'

const ContactEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(CONTACT_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.contact) {
    return <NotFound />
  }

  const { contact } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[contact.slug] = data.contact.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='lg:basis-1/3'>
          <ContactEditLeft contact={contact} />
        </div>
        <div className='lg:basis-2/3'>
          <ContactForm contact={contact} />
        </div>
      </div>
    </div>
  )
}

export default ContactEdit
