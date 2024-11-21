import PlaybookPlay from './PlaybookPlay'

const PlaybookPlays = ({ playbook, playRefs }) => {
  const { plays } = playbook

  return (
    <div className='playbook-plays'>
      {plays.map((play, i) =>
        <div className='flex flex-col gap-3' key={i}>
          <hr className='border-b border-dial-slate-200 mt-5' />
          <PlaybookPlay
            index={i}
            playbookSlug={playbook.slug}
            playSlug={play.slug}
            playRefs={playRefs}
          />
        </div>
      )}
    </div>
  )
}

export default PlaybookPlays
