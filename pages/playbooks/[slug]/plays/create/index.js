import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import { useIntl } from 'react-intl'
import withApollo from '../../../../../lib/apolloClient'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { PlayForm } from '../../../../../components/plays/PlayForm'
import { MoveListProvider } from '../../../../../components/plays/moves/MoveListContext'
import { MovePreviewProvider } from '../../../../../components/plays/moves/MovePreviewContext'
import MovePreview from '../../../../../components/plays/moves/MovePreview'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'

const PLAY_QUERY = gql`
  query Play($playbookSlug: String!) {
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

const CreateFormProvider = ({ children }) => {
  return (
    <MoveListProvider>
      <MovePreviewProvider>
        {children}
      </MovePreviewProvider>
    </MoveListProvider>
  )
}

function CreatePlay () {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug } = router.query
  const { loading, error, data } = useQuery(PLAY_QUERY, {
    variables: { playbookSlug: slug },
    skip: !slug,
    context: { headers: { 'Accept-Language': router.locale } }
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      {
        data && data.playbook &&
          <div className='px-8 max-w-catalog mx-auto'>
            <CreateFormProvider>
              <MovePreview />
              <PlayForm playbook={data.playbook} />
            </CreateFormProvider>
          </div>
      }
      <Footer />
    </>
  )
}

export default withApollo()(CreatePlay)
