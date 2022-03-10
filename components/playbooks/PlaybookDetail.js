import PlaybookDetailOverview from './PlaybookDetailOverview'
import PlaybookDetailNavigation from './PlaybookDetailNavigation'
import PlaybookDetailHeader from './PlaybookDetailHeader'
import PlaybookDetailPlayList from './PlaybookDetailPlayList'

const PlaybookDetail = ({ slug }) => {
  return (
    <div className='flex flex-col max-w-catalog mx-auto'>
      <PlaybookDetailHeader slug={slug} />
      <div className='flex gap-x-3'>
        <div className='w-1/4'>
          <PlaybookDetailNavigation slug={slug} />
        </div>
        <div className='flex flex-col gap-3 max-w-screen-lg'>
          <PlaybookDetailOverview slug={slug} />
          <PlaybookDetailPlayList slug={slug} />
        </div>
      </div>
    </div>
  )
}

export default PlaybookDetail
