import PlaybookDetailOverview from './PlaybookDetailOverview'
import PlaybookDetailNavigation from './PlaybookDetailNavigation'
import PlaybookDetailHeader from './PlaybookDetailHeader'
import PlaybookDetailPlayList from './PlaybookDetailPlayList'

const PlaybookDetail = ({ slug, locale }) => {
  return (
    <div className='sticky sticky-under-header flex flex-col max-w-catalog mx-auto'>
      <PlaybookDetailHeader slug={slug} />
      <div className='flex gap-x-3'>
        <div className='hidden lg:block w-1/4'>
          <PlaybookDetailNavigation slug={slug} />
        </div>
        <div className='flex flex-col gap-3 w-full max-w-screen-lg'>
          <PlaybookDetailOverview slug={slug} locale={locale} allowEmbedCreation />
          <PlaybookDetailPlayList slug={slug} locale={locale} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetail
