import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import withApollo from '../../../lib/apolloClient'
import { useQuery } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import Head from 'next/head'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Loading, Error } from '../../../components/shared/FetchStatus'

import { useIntl } from 'react-intl'

import { PlaybookForm } from '../../../components/playbooks/PlaybookForm'

const PLAYBOOK_QUERY = gql`
query Playbook($slug: String!) {
  playbook(slug: $slug) {
    id
    name
    slug
    tags
    phases
    playbookDescriptions {
      overview
      audience
      outcomes
      locale
    }
    plays {
      id
      name
    }
  }
}
`

function EditPlaybook() {

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()
  const { pathname, asPath, query } = useRouter()

  const { locale } = router
  const { slug } = router.query
  const { loading, error, data } = useQuery(PLAYBOOK_QUERY, { variables: { slug: slug, locale: locale }, skip: !slug })

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
      {data && data.playbook &&
        <PlaybookForm playbook={data.playbook} action='update' />
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditPlaybook)