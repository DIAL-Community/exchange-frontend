import { useCallback, useState } from 'react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FormattedDate, useIntl } from 'react-intl'
import DpiPagination from './DpiPagination'

const DEFAULT_PAGE_SIZE = 6

const AnnouncementCard = ({ index, announcement }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  console.log('Announcement: ', announcement)

  const { announcementDescription } = announcement

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {announcement.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-20 h-20 bg-white border shrink-0 flex justify-center'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + announcement.imageFile}
              alt={format('ui.image.logoAlt', { name: format('dpi.announcement.label') })}
              className='object-contain w-16 h-16 mx-auto self-center'
            />
          </div>
        }
        {announcement.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-20 h-20 bg-white rounded-full shrink-0 flex justify-center'>
            <img
              src='/ui/v1/playbook-header.svg'
              alt={format('ui.image.logoAlt', { name: format('dpi.announcement.label') })}
              className='object-contain w-12 h-12 mx-auto self-center'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold text-dial-stratos'>
            {announcement.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {announcementDescription && parse(announcementDescription?.sanitizedOverview)}
          </div>
          <div className='absolute top-2 right-2'>
            <FormattedDate date={announcement.announcementDate} />
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/dpi-announcement/${announcement.slug}`}>
        {displayLargeCard()}
      </Link>
    </div>
  )
}

const DpiAnnouncements = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [pageNumber, setPageNumber] = useState(0)
  const [announcements] = useState([{
    name: 'Placeholder for Announcement',
    slug: 'placeholder-for-announcement',
    imageFile: '/assets/playbooks/playbook-placeholder.svg',
    announcementDescription: {
      sanitizedOverview: `
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered
        alteration in some form, by injected humour, or randomized words which don't look even slightly
        believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't
        anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet
        tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.
        It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures,
        to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free
        from repetition, injected humour, or non-characteristic words etc.
      `
    },
    announcementDate: '2021-08-23'
  }])
  const [displayedAnnouncements, setDisplayedAnnouncements] = useState([...announcements.slice(0, DEFAULT_PAGE_SIZE)])

  const onClickHandler = useCallback(({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
    setDisplayedAnnouncements(
      announcements.slice(
        destinationPage * DEFAULT_PAGE_SIZE,
        (destinationPage + 1) * DEFAULT_PAGE_SIZE
      )
    )
  }, [announcements])

  return (
    <div className='announcement-section'>
      <div className='px-4 lg:px-8 xl:px-56'>
        <div className='text-2xl text-center py-8 text-dial-stratos'>
          {format('dpi.announcement.header')}
        </div>
        <div className='flex flex-col gap-8'>
          {displayedAnnouncements.map((announcement, index) =>
            <AnnouncementCard key={index} announcement={announcement} />
          )}
        </div>
        <DpiPagination
          pageNumber={pageNumber}
          totalCount={announcements.length}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          onClickHandler={onClickHandler}
          theme='dark'
        />
      </div>
    </div>
  )
}

export default DpiAnnouncements
