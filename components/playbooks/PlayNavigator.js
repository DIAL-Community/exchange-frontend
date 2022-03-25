import { useState } from 'react'
import { useIntl } from 'react-intl'
import parse from 'html-react-parser'
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import { useRouter } from 'next/router'
import { descriptionByLocale } from '../../lib/utilities'

const PlayNavigator = ({ playList }) => {
  const [currPlay, setCurrPlay] = useState(0)

  const changePlay = (i) => {
    setCurrPlay(i)
  }

  return (
    <div className='grid grid-cols-4'>
      <div>
        {playList && playList.map((play, i) => {
          return (
            <div key={i} className='border-2 p-2' onClick={(e) => changePlay(i)}>
              {play.name}
            </div>
          )
        })}
      </div>
      <div className='col-span-3'>
        {playList && playList.map((play, i) => {
          return currPlay === i && (<PlayDetail key={i} play={play} />)
        })}
      </div>
    </div>
  )
}

const PlayDetail = ({ play }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })
  const { locale } = useRouter()

  return (
    <div className='px-4'>
      <div className='h4 font-bold py-4'>{play.name}</div>
      <div className='h4'>
        {format('plays.description')}
      </div>
      <div className='fr-view tinyEditor text-dial-gray-dark px-4 py-2'>
        {parse(descriptionByLocale(play.playDescriptions, locale))}
      </div>
      <label className='block h4 pb-3'>
        {format('plays.buildingBlocks')}
      </label>
      <div className='text-dial-gray-dark px-4 pb-4'>
        This Play is associated with these building blocks
      </div>
      <label className='block h4 pb-3'>
        {format('plays.products')}
      </label>
      <div className='text-dial-gray-dark px-4 pb-4'>
        This Play is associated with these products
      </div>
      <label className='block h4 pb-3'>
        {format('plays.moves')}
      </label>
      {play.playMoves && play.playMoves.length > 0 && (
        <Accordion allowMultipleExpanded allowZeroExpanded>
          {play.playMoves && play.playMoves.map((move, i) => {
            return (
              <AccordionItem key={i}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    {move.name}
                    <AccordionItemPanel>
                      <div className='tinyEditor px-3'>{parse(descriptionByLocale(move.moveDescriptions, locale))}</div>
                      <div className='px-3 py-2'><div className='h4'>{format('moves.resources')}</div>
                        {move.resources && move.resources.map((resource, i) => {
                          return (
                            <div key={i} className='p-3 w-full'>
                              <a className='text-dial-yellow' href={resource.url} target='_blank' rel='noreferrer'>
                                {resource.name}
                              </a>
                              <div className='px-2'>{resource.description}</div>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionItemPanel>
                  </AccordionItemButton>
                </AccordionItemHeading>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </div>
  )
}

export default PlayNavigator
