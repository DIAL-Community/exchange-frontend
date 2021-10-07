import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import withApollo from '../../../../lib/apolloClient'
import { useQuery } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import Head from 'next/head'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'

import { useIntl } from 'react-intl'

import { PlaybookForm } from '../../../../components/playbooks/PlaybookForm'

const PLAYBOOK_QUERY = gql`
query Playbook($slug: String!, $locale: String!) {
  playbook(slug: $slug, locale: $locale) {
    id
    name
    playbookDescriptions {
      description
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
  const { loading, error, playbook } = useQuery(PLAYBOOK_QUERY, { variables: { slug: slug, locale: locale }, skip: !slug })

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleTextFieldChange = (e, callback) => {
    callback(e.target.value)
  }

  const updatePlaybook = async e => {
    e.preventDefault()

    createPlaybook({variables: {name: playbook.name, description: playbook.playbookDescriptions.description }});
  }

  return (
    <>
      <Head>
        <title>{format('app.title')}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <PlaybookForm playbook={playbook} />
      <Footer />
    </>
  )
}

export default withApollo()(EditPlaybook)