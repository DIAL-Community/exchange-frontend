import { useState } from 'react'
import { useIntl } from 'react-intl'
import ReactHtmlParser from 'react-html-parser'
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

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
        {ReactHtmlParser(descriptionByLocale(play.playDescriptions, locale))}
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
        {format('plays.tasks')}
      </label>
      {play.playTasks && play.playTasks.length > 0 && (
        <Accordion allowMultipleExpanded allowZeroExpanded>
          {play.playTasks && play.playTasks.map((task, i) => {
            return (
              <AccordionItem key={i}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    {task.name}
                    <AccordionItemPanel>
                      <div className='tinyEditor px-3'>{ReactHtmlParser(descriptionByLocale(task.taskDescriptions, locale))}</div>
                      <div className='px-3 py-2'><div className='h4'>{format('tasks.resources')}</div>
                        {task.resources && task.resources.map((resource, i) => {
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
