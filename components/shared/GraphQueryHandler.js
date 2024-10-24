import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaCircleExclamation, FaSpinner } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'

export const QueryErrorCode = {
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED'
}

export const LoadingHandler = () => {
  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaSpinner size='3em' className='spinner mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.processing' />
        </div>
      </div>
    </div>
  )
}

export const UnauthorizedErrorHandler = () => {
  useEffect(() => {
    signIn()
  }, [])

  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaSpinner size='3em' className='spinner mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.processing' />
        </div>
      </div>
    </div>
  )
}

export const BadRequestErrorHandler = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaSpinner size='3em' className='spinner mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.processing' />
        </div>
      </div>
    </div>
  )
}

export const ForbiddenErrorHandler = () => {
  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaCircleExclamation size='3em' className='spinner mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.error.forbidden' />
        </div>
      </div>
    </div>
  )
}

export const GeneralErrorHandler = () => {
  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaCircleExclamation size='3em' className='mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.error.general' />
        </div>
      </div>
    </div>
  )
}

export const NotFoundHandler = () => {
  return (
    <div className='min-h-[75vh] flex items-center justify-center'>
      <div className='flex flex-col gap-y-6'>
        <FaSpinner size='3em' className='spinner mx-auto' />
        <div className='text-center'>
          <FormattedMessage id='ui.general.error.notFound' />
        </div>
      </div>
    </div>
  )
}

export const handleQueryError = (error) => {
  if (error?.graphQLErrors) {
    const { graphQLErrors } = error
    for (let e of graphQLErrors) {
      switch (e.extensions.code) {
        case QueryErrorCode.UNAUTHORIZED:
          return <UnauthorizedErrorHandler />
        case QueryErrorCode.FORBIDDEN:
          return <UnauthorizedErrorHandler />
        case QueryErrorCode.BAD_REQUEST:
          return <BadRequestErrorHandler />
        default:
          return <GeneralErrorHandler />
      }
    }
  } else {
    return <GeneralErrorHandler />
  }
}

export const handleLoadingQuery = () => {
  return <LoadingHandler />
}

export const handleMissingData = () => {
  return <NotFoundHandler />
}
