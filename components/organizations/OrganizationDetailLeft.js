import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import ReactHtmlParser from 'react-html-parser'
import Breadcrumb from '../shared/breadcrumb'

const OrganizationDetailLeft = ({ organization }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const [session] = useSession()

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user
    return `
      ${process.env.NEXT_PUBLIC_RAILS_SERVER}/organizations/${organization.slug}/edit?user_email=${userEmail}&user_token=${userToken}
    `
  }

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name
    return map
  })()

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full'>
          {
            session && (
              <div className='inline'>
                {
                  session.user.canEdit && (
                    <a href={generateEditLink()} className='bg-dial-blue px-2 py-1 rounded text-white mr-5'>
                      <img src='/icons/edit.svg' className='inline mr-2 pb-1' alt='Edit' height='12px' width='12px' />
                      <span className='text-sm px-2'>{format('app.edit')}</span>
                    </a>
                  )
                }
              </div>
            )
          }
          <img src='/icons/comment.svg' className='inline mr-2' alt='Edit' height='15px' width='15px' />
          <div className='text-dial-blue inline'>{format('app.comment')}</div>
        </div>
        <div className='h4 font-bold py-4'>{format('organization.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray lg:mr-6 shadow-lg'>
        {
          organization.whenEndorsed && (
            <div className='flex flex-row p-1.5 border-b border-dial-gray text-xs font-semibold text-dial-cyan'>
              <img className='mr-2 h-6' src='/icons/digiprins/digiprins.png' />
              <div className='my-auto'>
                {`Endorsed on ${organization.whenEndorsed.substring(0, 4)}`.toUpperCase()}
              </div>
            </div>
          )
        }
        <div className='flex flex-col h-80 p-4'>
          <div className='text-2xl font-semibold absolute w-4/5 md:w-auto lg:w-64 2xl:w-80 text-dial-purple'>
            {organization.name}
          </div>
          <div className='m-auto align-middle w-40'>
            <img
              alt={format('image.alt.logoFor', { name: organization.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + organization.imageFile}
            />
          </div>
        </div>
        <div className='fr-view text-dial-gray-dark p-3'>
          {organization.organizationDescriptions[0] && ReactHtmlParser(organization.organizationDescriptions[0].description)}
        </div>
      </div>
      {
        !organization.owner &&
          <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 lg:mr-6 shadow-lg border-b-2 border-dial-gray'>
            {format('organization.owner')}
            <a
              className='text-dial-yellow block mt-2'
              href='https://docs.osc.dial.community/projects/product-registry/en/latest/org_owner.html'
              target='_blank' rel='noreferrer'
            >
              {format('organization.owner-link')}
            </a>
          </div>
      }
    </>
  )
}

export default OrganizationDetailLeft
