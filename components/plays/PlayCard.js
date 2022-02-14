import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import ReactHtmlParser from 'react-html-parser'

import { descriptionByLocale } from '../../lib/utilities'
import { useRouter } from 'next/router'

import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Plays')

const ellipsisTextStyle = `
   whitespace-nowrap overflow-ellipsis overflow-hidden my-auto
`

const PlayCard = ({ play, listType, assignCallback }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { locale } = useRouter()

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <>
      {
        listType === 'assign'
          ? (
            <div onClick={(e) => { assignCallback(e, play) }} className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
              <div className='bg-white border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className={`${ellipsisTextStyle} col-span-4 lg:col-span-4 pr-3 text-base font-semibold`}>
                    <img
                      data-tip={format('tooltip.forEntity', { entity: format('plays.label'), name: play.name })}
                      alt={format('image.alt.logoFor', { name: play.name })} className='m-auto h-6 workflow-filter inline mr-3'
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + play.imageFile}
                    />
                    {play.name}
                  </div>
                  <div className={`${ellipsisTextStyle} col-span-6 lg:col-span-4 pr-3 text-base max-h-10`}>
                    {ReactHtmlParser(descriptionByLocale(play.playDescriptions, locale))}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <Link href={`/${collectionPath}/${play.slug}`}>
              <div className='border-3 border-transparent hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
                <div className='border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70'>
                      {play.name}
                    </div>
                    <div className='m-auto align-middle w-40'>
                      <img
                        alt={format('image.alt.logoFor', { name: play.name })} className='workflow-filter'
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + play.imageFile}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark '>
                    <div className='flex flex-row border-b border-dial-gray'>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            )
      }
    </>
  )
}

export default PlayCard
