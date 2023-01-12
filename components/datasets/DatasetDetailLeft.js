import { useIntl } from 'react-intl'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useMutation, useQuery } from '@apollo/client'
import { FaSpinner } from 'react-icons/fa'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'
import CommentsCount from '../shared/CommentsCount'
import { ObjectType } from '../../lib/constants'
import { APPLY_AS_OWNER } from '../../mutations/users'
import { useDatasetOwnerUser, useUser } from '../../lib/hooks'
import { CANDIDATE_ROLE_QUERY } from '../../queries/candidate'
import { ToastContext } from '../../lib/ToastContext'
import DeleteDataset from './DeleteDataset'

const DatasetDetailLeft = ({ dataset, commentsSectionRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])
  const { showToast } = useContext(ToastContext)

  const { data: session } = useSession()
  const router = useRouter()
  const { locale } = router

  const { user, isAdminUser, loadingUserSession } = useUser()
  const { isDatasetOwner } = useDatasetOwnerUser(dataset,loadingUserSession || isAdminUser)

  const { data, error } = useQuery(CANDIDATE_ROLE_QUERY, {
    variables: {
      email: user?.userEmail,
      productId: '',
      organizationId: '',
      datasetId: dataset.id
    }
  })

  const [loading, setLoading] = useState(false)
  const [showApplyLink, setShowApplyLink] = useState(false)
  const [ownershipText, setOwnershipText] = useState('')

  const generateEditLink = () => {
    if (!session) {
      return '/edit-not-available'
    }

    return `/${locale}/datasets/${dataset.slug}/edit`
  }

  const slugNameMapping = (() => {
    const map = {}
    map[dataset.slug] = dataset.name

    return map
  })()

  const displayApplyOwnershipLink = (user) => {
    if (!user) {
      // Not logged in, don't display the link.
      return false
    }

    if (isDatasetOwner) {
      return false
    }

    if (data?.candidateRole === null || data?.candidateRole?.rejected) {
      return true
    }
  }

  const staticOwnershipTextSelection = (user) => {
    if (!user) {
      // Not logged in, don't display anything.
      return ''
    }

    if (isDatasetOwner) {
      return 'owner'
    }

    if (data?.candidateRole?.rejected === null) {
      // Applying to be the owner of the organization
      return 'applied-to-own'
    }
  }

  useEffect(() => {
    setShowApplyLink(displayApplyOwnershipLink(user))
    setOwnershipText(staticOwnershipTextSelection(user))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error, data])

  const [applyAsOwner] = useMutation(APPLY_AS_OWNER, {
    refetchQueries: ['CandidateRole'],
    onCompleted: (data) => {
      if (data.applyAsOwner.errors.length) {
        showToast(
          <div className='flex flex-col'>
            <span>{data.applyAsOwner.errors[0]}</span>
          </div>,
          'error',
          'top-center',
          null,
          () => setLoading(false)
        )
      } else {
        showToast(
          format('toast.applyAsOwner.submit.success', { entity: format('dataset.label') }),
          'success',
          'top-center',
          null,
          () => setLoading(false)
        )
      }
    },
    onError: (error) => {
      showToast(
        <div className='flex flex-col'>
          <span>{error?.message}</span>
        </div>,
        'error',
        'top-center',
        null,
        () => setLoading(false)
      )
    }
  })

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user
      setLoading(true)

      applyAsOwner({
        variables: {
          entity: ObjectType.DATASET,
          entityId: parseInt(dataset.id)
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full inline-flex gap-3'>
          {(isAdminUser || isDatasetOwner) && <EditButton type='link' href={generateEditLink()} />}
          {isAdminUser && <DeleteDataset dataset={dataset} />}
          <CommentsCount commentsSectionRef={commentsSectionRef} objectId={dataset.id} objectType={ObjectType.OPEN_DATA}/>
        </div>
        <div className='h4 font-bold py-4'>{format('datasets.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='flex flex-col h-80 p-2'>
          <div className='h1 p-2 text-dial-purple'>
            {dataset.name}
          </div>
          <div className='m-auto w-3/5 h-3/5 relative' >
            <Image
              layout='fill'
              objectFit='contain'
              sizes='100vw'
              alt={`${dataset.name} Logo`} className='p-2 m-auto'
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              width='200px' height='200px'
            />
          </div>
        </div>
        <div className='fr-view text-dial-gray-dark line-clamp-4'>
          {dataset.datasetDescription && parse(dataset.datasetDescription.description)}
        </div>
      </div>
      <div className='bg-dial-gray-dark text-xs text-dial-gray-light p-6 lg:mr-6 shadow-lg border-b-2 border-dial-gray'>
        {format('dataset.owner')}
        <div className='flex flex-row gap-3'>
          {
            showApplyLink &&
              <button
                className='text-dial-yellow block mt-2 border-b border-transparent hover:border-dial-yellow'
                onClick={onSubmit} disabled={loading}
              >
                {format('ownership.apply')}
                {loading && <FaSpinner className='inline spinner ml-1' />}
              </button>
          }
          {
            ownershipText &&
            <>
              <div className='text-dial-gray-light block mt-2'>
                {ownershipText === 'owner' ? format('ownership.owned') : format('ownership.applied')}
              </div>
            </>
          }
        </div>
      </div>
    </>
  )
}

export default DatasetDetailLeft
