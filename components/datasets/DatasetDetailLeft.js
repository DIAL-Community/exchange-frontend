import { useIntl } from 'react-intl'
import { useSession } from 'next-auth/client'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import Breadcrumb from '../shared/breadcrumb'
import EditButton from '../shared/EditButton'

const DatasetDetailLeft = ({ dataset }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, values)

  const [session] = useSession()
  const router = useRouter()
  const { locale } = router

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

  return (
    <>
      <div className='block lg:hidden'>
        <Breadcrumb slugNameMapping={slugNameMapping} />
      </div>
      <div className='h-20'>
        <div className='w-full'>
          {session && (
            <div className='inline'>
              {session.user.canEdit && (
                <EditButton type='link' href={generateEditLink()} />
              )}
            </div>
          )}
        </div>
        <div className='h4 font-bold py-4'>{format('datasets.label')}</div>
      </div>
      <div className='bg-white border-t-2 border-l-2 border-r-2 border-dial-gray p-6 lg:mr-6 shadow-lg'>
        <div id='header' className='mb-4'>
          <div className='h1 p-2 text-dial-purple'>
            {dataset.name}
          </div>
          <img
            alt={`${dataset.name} Logo`} className='p-2 m-auto'
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
            width='200px' height='200px'
          />
        </div>
        <div className='fr-view text-dial-gray-dark max-h-40 overflow-hidden'>
          {dataset.datasetDescription && parse(dataset.datasetDescription.description)}
        </div>
      </div>
    </>
  )
}

export default DatasetDetailLeft
