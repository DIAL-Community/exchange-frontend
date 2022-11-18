import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { FaHome, FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { prependUrlWithProtocol } from '../../../lib/utilities'

const ellipsisTextStyle = 'whitespace-nowrap text-ellipsis overflow-hidden my-auto'
const hoverEffectTextStyle = 'border-b-2 border-transparent hover:border-dial-yellow'

const OrganizationCard = ({ organization, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { data: session } = useSession()

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  const approveCandidateOrganization = async (e) => {
    const { userEmail, userToken } = session.user

    e.preventDefault()
    setLoading(true)

    const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_organizations/${organization.id}/approve` +
      `?user_email=${userEmail}&user_token=${userToken}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_RAILS_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      }
    })

    if (response.status === 200) {
      setStatus('approved')
    }

    setLoading(false)
  }

  const rejectCandidateOrganization = async (e) => {
    const { userEmail, userToken } = session.user

    e.preventDefault()
    setLoading(true)

    const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_organizations/${organization.id}/reject` +
      `?user_email=${userEmail}&user_token=${userToken}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_RAILS_SERVER,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Set-Cookie'
      }
    })

    if (response.status === 200) {
      setStatus('rejected')
    }

    setLoading(false)
  }

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-gray text-workflow cursor-pointer'>
              <div className={`
                ${String(organization.rejected) === 'true' || status === 'rejected'
                ? 'bg-red-50'
                : String(organization.rejected) === 'false' || status === 'approved'
                  ? 'bg-emerald-50'
                  : 'bg-white'}
                border border-dial-gray hover:border-transparent card-drop-shadow
              `}
              >
                <div className='grid grid-cols-12 gap-4 py-4 px-4 text-organization'>
                  <div className={`col-span-12 lg:col-span-4 my-auto ${ellipsisTextStyle}`}>
                    {organization.name}
                    <div className='block lg:hidden font-semibold text-sm'>
                      {organization.website}
                    </div>
                    {
                      String(organization.rejected) === 'null' && session && session.user && status === '' &&
                        <div className='flex lg:hidden mt-3 flex-row'>
                          <button
                            className={`
                                  my-auto px-3 py-1 text-sm font-semibold ml-auto
                                  border border-dial-gray-dark text-dial-gray-dark rounded
                                  hover:bg-opacity-20 hover:bg-dial-gray-dark
                                `}
                            onClick={rejectCandidateOrganization}
                            disabled={loading}
                          >
                            <span className='inline'>
                              {format('candidate.reject')}
                            </span>
                            <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
                          </button>
                          <button
                            className={`
                                  ml-3 my-auto px-3 py-1 text-sm font-semibold bg-dial-gray-dark text-white
                                  border-2 border-dial-gray-dark bg-dial-gray-dark text-white rounded
                                  hover:bg-opacity-80
                                `}
                            onClick={approveCandidateOrganization}
                            disabled={loading}
                          >
                            <span className='inline'>
                              {format('candidate.approve')}
                            </span>
                            <FaRegCheckCircle className='ml-1 inline text-xl text-emerald-500' />
                          </button>
                        </div>
                    }
                  </div>
                  <div className='hidden lg:block lg:col-span-4'>
                    {organization.website}
                  </div>
                  {
                    String(organization.rejected) === 'null' && status === '' && session?.user?.canEdit &&
                      <div className='hidden lg:flex lg:col-span-4 flex-row'>
                        <button
                          className={`
                                my-auto px-3 py-1 text-sm font-semibold ml-auto
                                border border-dial-gray-dark text-dial-gray-dark rounded
                                hover:bg-opacity-20 hover:bg-dial-gray-dark
                              `}
                          onClick={rejectCandidateOrganization}
                          disabled={loading}
                        >
                          <span className='hidden lg:inline'>
                            {format('candidate.reject')}
                          </span>
                          <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
                        </button>
                        <button
                          className={`
                                mx-3 my-auto px-3 py-1 text-sm font-semibold bg-dial-gray-dark text-white
                                border-2 border-dial-gray-dark bg-dial-gray-dark text-white rounded
                                hover:bg-opacity-80
                              `}
                          onClick={approveCandidateOrganization}
                          disabled={loading}
                        >
                          <span className='hidden lg:inline'>
                            {format('candidate.approve')}
                          </span>
                          <FaRegCheckCircle className='ml-1 inline text-xl text-emerald-500' />
                        </button>
                      </div>
                  }
                </div>
              </div>
            </div>
          )
          : (
            <div className='border-3 border-transparent hover:border-dial-gray text-dial-purple h-full'>
              <div className='h-full flex flex-col border border-dial-gray card-drop-shadow'>
                <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
                  {
                    (String(organization.rejected) === 'true' || status === 'rejected') &&
                      <div className='bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                        {format('candidate.rejected').toUpperCase()}
                      </div>
                  }
                  {
                    (String(organization.rejected) === 'false' || status === 'approved') &&
                      <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                        {format('candidate.approved').toUpperCase()}
                      </div>
                  }
                </div>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                    {organization.name}
                  </div>
                  <div className='m-auto w-40'>
                    {organization.description}
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                  <div className='flex flex-col border-b border-dial-gray'>
                    <div className='pl-3 py-2 flex flex-row border-b'>
                      <div className='w-6 my-auto'>
                        <FaHome className='text-xl' data-tip={format('candidateOrganization.website.hint')} />
                      </div>
                      <div className={`mx-2 my-auto px-2 py-1 bg-white ${ellipsisTextStyle} ${hoverEffectTextStyle}`}>
                        {
                          organization.website
                            ? <a href={prependUrlWithProtocol(organization.website)} target='_blank' rel='noreferrer'>{organization.website}</a>
                            : format('general.na')
                        }
                      </div>
                    </div>
                    {
                      String(organization.rejected) === 'null' && status === '' && session?.user?.canEdit &&
                        <div className='pl-3 py-2 flex flex-row'>
                          <button
                            className={`
                                my-auto px-3 py-1 text-sm font-semibold mr-auto
                                border border-dial-gray-dark text-dial-gray-dark rounded
                                hover:bg-opacity-20 hover:bg-dial-gray-dark
                              `}
                            onClick={rejectCandidateOrganization}
                            disabled={loading}
                          >
                            {format('candidate.reject')}  <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
                          </button>
                          <button
                            className={`
                                mx-3 my-auto px-3 py-1 text-sm font-semibold ml-auto bg-dial-gray-dark text-white
                                border-2 border-dial-gray-dark bg-dial-gray-dark text-white rounded
                                hover:bg-opacity-80
                              `}
                            onClick={approveCandidateOrganization}
                            disabled={loading}
                          >
                            {format('candidate.approve')} <FaRegCheckCircle className='ml-1 inline text-xl text-emerald-500' />
                          </button>
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          )
      }
    </>
  )
}

export default OrganizationCard
