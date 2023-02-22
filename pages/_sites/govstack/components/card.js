/* eslint-disable max-len */
import React from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { getStrapiMedia } from '../../../../lib/media'

const Card = ({ article }) => {

  return (
    <div className='border-2 border-dial-gray hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
      <Link href={`/article/${article?.attributes.slug}`}>
        <a>
          <div className='p-3 uk-card uk-card-muted'>
            <div className='uk-card-media-top'>
              { article && (
                <NextImage layout='responsive' objectFit='contain' width={article.attributes.image.data.attributes.width} height={article.attributes.image.data.attributes.height} src={getStrapiMedia(article.attributes.image)} alt={article.attributes.image.data.attributes.alternativeText || ''} />
              )}
            </div>
            <div className='p-3'>
              <p id='category' className='uk-text-uppercase'>
                {article?.attributes.category?.data.attributes.name}
              </p>
              <p id='title' className='uk-text-large'>
                {article?.attributes.title}
              </p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default Card
