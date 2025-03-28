import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { gql, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { HtmlViewer } from '../../shared/form/HtmlViewer'
import { handleLoadingQuery, handleQueryError } from '../../shared/GraphQueryHandler'

const AdliArticle = ({ articleId }) => {
  const [url, setUrl] = useState(null)
  const [title, setTitle] = useState(null)
  const [media, setMedia] = useState(null)
  const [authors, setAuthors] = useState([])

  const processAuthorBlock = (coAuthors) => {
    setAuthors(coAuthors.map(coAuthor => {
      return ({
        id: coAuthor['user_nicename'],
        name: coAuthor['display_name']
      })
    }))
  }

  const processMediaBlock = (mediaBlock) => {
    mediaBlock.forEach((mediaEntry) => {
      const { href } = mediaEntry
      fetch(href)
        .then((response) => response.json())
        .then((data) => {
          const mediaSizes = data['media_details']['sizes']
          const selectedMedia = mediaSizes['width_400']
          setMedia(selectedMedia['source_url'])
        })
    })
  }

  useEffect(() => {
    fetch(`https://dial.global/wp-json/wp/v2/posts?slug=${articleId}`)
      .then((response) => response.json())
      .then((data) => {
        // Process the first article. Searching by slug will return single article in the array.
        const [currentArticle] = data
        // Set the url of the article.
        setUrl(currentArticle['link'])

        // Co-authors is exposed now in the wp-json endpoint.
        processAuthorBlock(currentArticle['coauthors'])

        // Need to process the attachment url and display the correct image.
        processMediaBlock(currentArticle['_links']['wp:featuredmedia'])

        // Process the title of the article.
        const { rendered } = currentArticle['title']
        setTitle(rendered)
      })
  }, [articleId])

  return (
    <div className='flex flex-col gap-4'>
      <a href={url} target='_blank' rel='noreferrer'>
        <div className='flex flex-col gap-2'>
          <img src={media} alt={title} className='object-cover h-72' />
          <div className='text-2xl font-semibold'>
            {title}
          </div>
        </div>
      </a>
      <div className='flex flex-row gap-1'>
        {authors.map((author, index) => (
          <>
            <div key={index} className='text-sm'>
              <a href={`https://dial.global/profile/${author.id}`} target='_blank' rel='noreferrer'>
                {author.name}
              </a>
            </div>
            {index < authors.length - 1 && <div className='text-sm'>|</div>}
          </>
        ))}
      </div>
    </div>
  )
}

const HubAdli = () => {
  const ADLI_CONFIGURATION_QUERY = gql`
    query AdliConfiguration {
      adliConfiguration
    }
  `

  const { loading, data, error } = useQuery(ADLI_CONFIGURATION_QUERY, {
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  }

  const { linkedInUrns, articleIds, subHeader } = data?.adliConfiguration || {}

  return (
    <div className='px-4 lg:px-8 xl:px-24 3xl:px-56 max-w-catalog mx-auto'>
      <div className='flex flex-col gap-4'>
        <div className='pt-8'>
          <HtmlViewer initialContent={subHeader.replace(/\r?\n|\r/g, '')} />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12 py-8'>
          <div className='flex flex-col gap-8'>
            <div className='text-xl font-semibold'>
              <FormattedMessage id='hub.adli.linkedInTitle' />
            </div>
            <div className='h-[800px] md:h-[1200px] lg:h-[1000px] xl:h-[1200px] 2xl:h-[1000px]'>
              <Swiper
                pagination={true}
                autoplay={{
                  delay: 10000,
                  disableOnInteraction: false
                }}
                modules={[Autoplay, Pagination, Navigation]}
              >
                {linkedInUrns.map((urn) => (
                  <SwiperSlide key={urn}>
                    <iframe
                      src={`https://www.linkedin.com/embed/feed/update/${urn}?collapsed=1`}
                      height="100%"
                      width="100%"
                      allowFullScreen=""
                      title="Embedded post"
                    ></iframe>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className='flex flex-col gap-8 2xl:col-span-2'>
            <div className='text-xl font-semibold'>
              <FormattedMessage id='hub.adli.articleTitle' />
            </div>
            <div className='flex flex-col 2xl:flex-row gap-8'>
              {articleIds.map((articleId) => (
                <div key={articleId} className='2xl:basis-1/2'>
                  <AdliArticle articleId={articleId} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HubAdli
