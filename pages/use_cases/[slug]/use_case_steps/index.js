
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import withApollo from '../../../../lib/apolloClient'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Breadcrumb from '../../../../components/shared/breadcrumb'
import StepList from '../../../../components/use-cases/steps/StepList'

const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      name
      slug
      maturity
      imageFile
    }
  }
`

// Create the top left header of the step list.
const UseCaseHeader = ({ useCase }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  return (
    <div className='border'>
      <div className='text-xs text-right text-dial-cyan font-semibold p-1.5 border-b uppercase'>{useCase.maturity}</div>
      <Link href={`/use_cases/${useCase.slug}`}>
        <div className='cursor-pointer px-4 py-6 flex items-center'>
          <img
            className='use-case-filter w-8 h-full'
            alt={format('image.alt.logoFor', { name: useCase.name })}
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
          />
          <div className='text-xl text-use-case font-semibold px-4'>{useCase.name}</div>
        </div>
      </Link>
    </div>
  )
}

const UseCaseStep = () => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const router = useRouter()
  const { slug, stepSlug } = router.query

  const { data } = useQuery(USE_CASE_QUERY, { variables: { slug: slug } })

  const slugNameMapping = (() => {
    const map = {}
    if (data) {
      map[data.useCase.slug] = data.useCase.name
    }

    return map
  })()

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='flex flex-wrap justify-between pb-8 max-w-catalog mx-auto'>
        <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          <div className='block lg:hidden'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
          {data?.useCase && <UseCaseHeader useCase={data.useCase} />}
          <StepList useCaseSlug={slug} stepSlug={stepSlug} listStyle='compact' shadowOnContainer />
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <div className='hidden lg:block'>
            <Breadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(UseCaseStep)
