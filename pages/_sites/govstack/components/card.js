import React from 'react'
import Link from 'next/link'
import NextImage from './image'

const Card = ({ article }) => {

  return (
    <div className='border-2 border-dial-gray hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
      <Link href={`/article/${article.attributes.slug}`}>
        <a>
          <div className='p-3 uk-card uk-card-muted'>
            <div className='uk-card-media-top'>
              <NextImage image={article.attributes.image} />
            </div>
            <div className='p-3'>
              <p id='category' className='uk-text-uppercase'>
                {article.attributes.category?.data.attributes.name}
              </p>
              <p id='title' className='uk-text-large'>
                {article.attributes.title}
              </p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default Card