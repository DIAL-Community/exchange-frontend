import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import Head from 'next/head'

import withApollo from '../../../../../lib/apolloClient'

import StepList from '../../../../../components/use-cases/steps/StepList'
import StepDetail from '../../../../../components/use-cases/steps/StepDetail'
import Breadcrumb from '../../../../../components/shared/breadcrumb'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { gql, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/client'

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

const UseCaseStep = () => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const [session] = useSession()
  const { slug, stepSlug } = router.query
  const { loading, data } = useQuery(USE_CASE_QUERY, { variables: { slug: slug } })

  const generateEditLink = () => {
    if (!session.user) {
      return '/edit-not-available'
    }

    const { userEmail, userToken } = session.user
    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/use_cases/${slug}/use_case_steps/${stepSlug}/` +
        `edit?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

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
          <div className='w-full mb-2'>
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
          </div>
          {
            data && data.useCase &&
              <>
                <div className='border'>
                  <div className='text-xs text-right text-dial-cyan font-semibold p-1.5 border-b uppercase'>{data.useCase.maturity}</div>
                  <Link href={`/use_cases/${slug}`}>
                    <div className='cursor-pointer px-4 py-6 flex items-center'>
                      <img
                        className='use-case-filter w-8 h-full'
                        alt={format('image.alt.logoFor', { name: data.useCase.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + data.useCase.imageFile}
                      />
                      <div className='text-xl text-use-case font-semibold px-4'>{data.useCase.name}</div>
                    </div>
                  </Link>
                </div>
              </>
          }
          <StepList useCaseSlug={slug} stepSlug={stepSlug} listStyle='compact' shadowOnContainer/>
        </div>
        <div className='w-full lg:w-2/3 xl:w-3/4'>
          <StepDetail stepSlug={stepSlug} />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default withApollo()(UseCaseStep)
