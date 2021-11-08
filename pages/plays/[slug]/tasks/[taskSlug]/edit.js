import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import withApollo from '../../../../../lib/apolloClient'
import { useQuery } from "@apollo/react-hooks"
import gql from 'graphql-tag'

import Head from 'next/head'
import Header from '../../../../../components/Header'
import Footer from '../../../../../components/Footer'
import { Loading, Error } from '../../../../../components/shared/FetchStatus'

import { useIntl } from 'react-intl'

import { TaskForm } from '../../../../../components/plays/tasks/TaskForm'

const TASK_QUERY = gql`
query Task($slug: String!) {
  task(slug: $slug) {
    id
    name
    slug
    resources
    taskDescriptions {
      description
      locale
    }
    playName
    playSlug
  }
}
`

function EditTask() {

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const router = useRouter()

  const { locale } = router
  const { taskSlug } = router.query
  const { loading, error, data } = useQuery(TASK_QUERY, { variables: { slug: taskSlug, locale: locale }, skip: !taskSlug })

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
      {data && data.task &&
        <TaskForm task={data.task} action='update' />
      }
      <Footer />
    </>
  )
}

export default withApollo()(EditTask)