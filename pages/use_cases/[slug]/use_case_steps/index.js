import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Head from 'next/head'

import withApollo from '../../../../lib/apolloClient'

import StepList from '../../../../components/use-cases/steps/StepList'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { gql, useQuery } from '@apollo/client'
import Breadcrumb from '../../../../components/shared/breadcrumb'

const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      name
      maturity
      imageFile
    }
  }
`

const UseCaseStep = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { slug, stepSlug } = router.query
  const { data } = useQuery(USE_CASE_QUERY, { variables: { slug: slug } })

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='flex flex-wrap justify-between pb-8'>
        <div className='relative md:sticky md:top-66px w-full md:w-1/3 xl:w-1/4 h-full py-4 px-4'>
          {
            data && data.useCase &&
              <div className='border'>
                <div className='text-xs text-right text-dial-cyan font-semibold p-1.5 border-b uppercase'>{data.useCase.maturity}</div>
                <div className=' px-4 py-6 flex'>
                  <img
                    className='use-case-filter w-8'
                    alt={format('image.alt.logoFor', { name: data.useCase.name })}
                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.useCase.imageFile}
                  />
                  <div className='text-xl text-use-case font-semibold px-4'>{data.useCase.name}</div>
                </div>
              </div>
          }
          <StepList useCaseSlug={slug} stepSlug={stepSlug} listStyle='compact' shadowOnContainer />
        </div>
        <div className='w-full md:w-2/3 xl:w-3/4'>
          <Breadcrumb />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(UseCaseStep)
