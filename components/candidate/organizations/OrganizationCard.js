import { useCallback, useState } from 'react'
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { prependUrlWithProtocol } from '../../../lib/utilities'
import { CandidateStatusType } from '../../../lib/constants'
import { useUser } from '../../../lib/hooks'

const hoverEffectTextStyle = 'border-b-2 border-transparent hover:border-dial-sunshine'

const OrganizationCard = ({ organization, listType }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const approveCandidateOrganization = async (e) => {
    const { userEmail, userToken } = user

    e.preventDefault()
    setLoading(true)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_organizations/${organization.id}/approve` +
      `?user_email=${userEmail}&user_token=${userToken}`,
      {
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
      }
    )

    if (response.status === 200) {
      setStatus(CandidateStatusType.APPROVED)
    }

    setLoading(false)
  }

  const rejectCandidateOrganization = async (e) => {
    const { userEmail, userToken } = user

    e.preventDefault()
    setLoading(true)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILS_SERVER}/candidate_organizations/${organization.id}/reject` +
      `?user_email=${userEmail}&user_token=${userToken}`,
      {
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
      }
    )

    if (response.status === 200) {
      setStatus(CandidateStatusType.REJECTED)
    }

    setLoading(false)
  }

  return (
    <>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent'>
              <div className={classNames('border border-dial-gray shadow-md bg-white',
                { 'bg-red-50': organization.rejected === true || status === CandidateStatusType.REJECTED },
                { 'bg-emerald-50': organization.rejected === false || status === CandidateStatusType.APPROVED }
              )}
              >
                <div className='flex flex-col xl:flex-row gap-3 p-3 text-organization'>
                  <div className='w-full xl:w-1/3 my-auto line-clamp-1'>
                    {organization.name}
                  </div>
                  <div className='w-full xl:w-1/3 my-auto line-clamp-1'>
                    {
                      organization.website
                        ? (
                          <a href={prependUrlWithProtocol(organization.website)} target='_blank' rel='noreferrer'>
                            {organization.website} ⧉
                          </a>
                        )
                        : format('general.na')
                    }
                  </div>
                  {
                    organization.rejected === null && status === '' &&
                      <div className='ml-auto flex flex-row gap-3'>
                        <button
                          className='text-sm secondary-button'
                          onClick={rejectCandidateOrganization}
                          disabled={loading}
                        >
                          <span className='hidden lg:inline'>
                            {format('candidate.reject')}
                          </span>
                          <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
                        </button>
                        <button
                          className='text-sm submit-button'
                          onClick={approveCandidateOrganization}
                          disabled={loading}
                        >
                          <span className='hidden lg:inline'>
                            {format('candidate.approve')}
                          </span>
                          <FaRegCheckCircle className='ml-1 inline text-xl' />
                        </button>
                      </div>
                  }

                  {
                    (organization.rejected === true || status === CandidateStatusType.REJECTED) &&
                      <div className='ml-auto bg-red-500 py-2 px-3 rounded text-white text-sm'>
                        {format('candidate.rejected').toUpperCase()}
                      </div>
                  }
                  {
                    (organization.rejected === false || status === CandidateStatusType.APPROVED) &&
                      <div className='ml-auto bg-emerald-500 py-2 px-3 rounded text-white text-sm'>
                        {format('candidate.approved').toUpperCase()}
                      </div>
                  }
                </div>
              </div>
            </div>
          )
          : (
            <div className='border-3 border-transparent text-dial-purple h-full'>
              <div className='h-full flex flex-col border border-dial-gray shadow-md'>
                <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
                  {
                    (organization.rejected === true || status === CandidateStatusType.REJECTED) &&
                      <div className='bg-red-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                        {format('candidate.rejected').toUpperCase()}
                      </div>
                  }
                  {
                    (organization.rejected === false || status === CandidateStatusType.APPROVED) &&
                      <div className='bg-emerald-500 py-1 px-2 rounded text-white text-sm font-semibold'>
                        {format('candidate.approved').toUpperCase()}
                      </div>
                  }
                  {
                    organization.rejected === null &&
                      <div className='ml-auto py-1 px-2 rounded text-dial-cyan text-sm font-semibold'>
                        {format('candidate.header').toUpperCase()}
                      </div>
                  }
                </div>
                <div className='flex flex-col h-64 p-4'>
                  <div className='text-2xl font-semibold'>
                    {organization.name}
                  </div>
                  <div className='mt-3 text-justify line-clamp-6'>
                    {organization.description && parse(organization.description)}
                  </div>
                </div>
                <div className='mt-auto py-3 px-2 flex flex-col gap-3 bg-dial-gray-light text-dial-gray-dark'>
                  <div className='flex py-1'>
                    {
                      organization.website
                        ? (
                          <a
                            href={prependUrlWithProtocol(organization.website)}
                            target='_blank'
                            rel='noreferrer'
                            className='py-1 px-2 bg-white line-clamp-1'
                          >
                            <span className={classNames(hoverEffectTextStyle)}>{organization.website} ⧉</span>
                          </a>
                        )
                        : (
                          <div className='py-1 px-2 bg-white line-clamp-1'>
                            {format('general.na')}
                          </div>
                        )
                    }
                  </div>
                  {
                    organization.rejected === null && status === '' &&
                      <>
                        <div className='border-t'></div>
                        <div className='ml-auto flex flex-row gap-3 '>
                          <button
                            className='secondary-button text-sm'
                            onClick={rejectCandidateOrganization}
                            disabled={loading}
                          >
                            {format('candidate.reject')}
                            <FaRegTimesCircle className='ml-1 inline text-xl text-red-500' />
                          </button>
                          <button
                            className='submit-button text-sm'
                            onClick={approveCandidateOrganization}
                            disabled={loading}
                          >
                            {format('candidate.approve')}
                            <FaRegCheckCircle className='ml-1 inline text-xl' />
                          </button>
                        </div>
                      </>
                  }
                </div>
              </div>
            </div>
          )
      }
    </>
  )
}

export default OrganizationCard
