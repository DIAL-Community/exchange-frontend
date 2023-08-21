import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useIntl, IntlProvider } from 'react-intl'
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer'
import { gql, useQuery } from '@apollo/client'
import parse from 'html-react-parser'
import { HiExternalLink } from 'react-icons/hi'
import { Error, Loading, NotFound, ReadyToDownload } from '../shared/FetchStatus'

const PLAYBOOK_DETAIL_QUERY = gql`
  query Playbook($slug: String!) {
    playbook(slug: $slug) {
      id
      slug
      name
      playbookDescription {
        id
        overview
        audience
        outcomes
      }
      plays {
        id
        slug
        name
        imageFile
        playDescription {
          id
          description
        }
        playMoves {
          id
          slug
          name
          resources
          moveOrder
          moveDescription {
            id
            description
          }
        }
      }
    }
  }
`

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    color: '#46465A'
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15
  },
  h4: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10
  },
  desc: {
    fontSize: 12,
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  link: {
    fontSize: 12,
    paddingHorizontal: 35,
    marginBottom: 5,
    color: '#faab19'
  },
  moveHeader: {
    backgroundColor: '#feeed1',
    fontWeight: 800,
    fontSize: 16,
    padding: 5,
    marginHorizontal: 25,
    marginVertical: 10
  },
  moveDesc: {
    paddingHorizontal: 30,
    fontSize: 12
  },
  resourcesHeader: {
    fontSize: 14,
    marginVertical: 10,
    marginHorizontal: 30
  }
})

const MoveContent = ({ move, format }) => {
  return (
    <div>
      <div className='font-semibold px-4 py-4 my-auto'>
        <Text style={styles.moveHeader}>
          {move.name}
        </Text>
      </div>
      <div className='flex flex-col border border-dial-orange-light'>
        <div className='px-4 py-4'>
          <div className='fr-view text-dial-gray-dark'>
            <Text style={styles.moveDesc}>
              {move?.moveDescription && parse(move.moveDescription.description)}
            </Text>
          </div>
          {move?.resources && move?.resources.length > 0 &&
            <>
              <div className='font-semibold py-2'>
                <Text style={styles.resourcesHeader}>
                  {format('ui.move.resources.header')}
                </Text>
              </div>
              <div className='flex flex-wrap gap-3'>
                {move?.resources.map(resource => {
                  return (
                    <a key={resource.i} target='_blank' rel='noreferrer' href={resource.url}>
                      <div
                        key={resource.i}
                        className='group border-2 border-gray-300 hover:border-dial-sunshine shadow-md'
                      >
                        <div className='flex'>
                          <div className='flex flex-col gap-2 px-3 py-4'>
                            <div className='font-semibold'>
                              <Text style={styles.link}>
                                {resource.name}
                              </Text>
                            </div>
                          </div>
                          <HiExternalLink className='ml-auto px-2' size='2.2em' />
                        </div>
                      </div>
                    </a>
                  )})
                }
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}

const PlaybookContent = ({ format, data, locale }) => {
  return (
    <Document>
      <Page style={styles.page} size="A4">
        <IntlProvider locale={ locale }>
          <div className='my-4 mx-2'>
            <div className='h1 mb-4 h-12'>
              <Text style={styles.h1}>
                {format('ui.playbook.label')}: {data.playbook.name}
              </Text>
            </div>
            <div className='h4'>
              <Text style={styles.h4}>
                {format('ui.playbook.overview')}
              </Text>
            </div>
            <div className='fr-view tiny-editor text-dial-gray-dark'>
              <Text style={styles.desc}>
                {parse(data.playbook.playbookDescription.overview)}
              </Text>
            </div>
            <div className='h4'>
              <Text style={styles.h4}>
                {format('ui.playbook.audience')}
              </Text>
            </div>
            <div className='fr-view tiny-editor text-dial-gray-dark'>
              <Text style={styles.desc}>
                {parse(data.playbook.playbookDescription.audience)}
              </Text>
            </div>
            <div className='h4'>
              <Text style={styles.h4}>
                {format('ui.playbook.outcomes')}
              </Text>
            </div>
            <div className='fr-view tiny-editor text-dial-gray-dark'>
              <Text style={styles.desc}>
                {parse(data.playbook.playbookDescription.outcomes)}
              </Text>
            </div>
            { data.playbook.plays?.map((play, index) => {
              return (<div className='flex flex-col gap-4' key={index}>
                <div className='h-px border-b' />
                <div className='font-semibold text-2xl py-4'>
                  <Text style={styles.h1}>
                    {`${format('ui.play.label')} ${index + 1}. ${play.name}`}
                  </Text>
                </div>
                <div className='fr-view tiny-editor text-dial-gray-dark'>
                  <Text style={styles.desc}>
                    {parse(play.playDescription.description)}
                  </Text>
                </div>
                <div className='flex flex-col gap-3'>
                  {
                    play.playMoves.map((move, i) =>
                      <MoveContent key={i} move={move} format={format} />
                    )
                  }
                </div>
              </div>)
            })}
          </div>
        </IntlProvider>
      </Page>
    </Document>
  )
}

const PlaybookPdf = ({ locale }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const router = useRouter()
  const { query } = router
  const { slug } = query

  const { loading, error, data } = useQuery(PLAYBOOK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.playbook) {
    return <NotFound />
  }

  if (error) {
    return <Error />
  }

  return (
    <PDFDownloadLink
      document={
        <PlaybookContent
          format={format}
          data={
            JSON.parse(
              JSON
                .stringify(data)
                .replaceAll('<img ', '<Image style={{width: 800}} ')
            )
          }
          locale={locale}
        />
      }
      fileName={`${slug}.pdf`}
    >
      {({ loading }) => (loading ? <Loading /> : <ReadyToDownload />)}
    </PDFDownloadLink>
  )
}

export default PlaybookPdf
