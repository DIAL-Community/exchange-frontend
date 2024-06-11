import { useCallback } from 'react'
import { FaLinkedin, FaSquareFacebook, FaSquareInstagram, FaSquarePhone, FaSquareXTwitter } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import {
  FACEBOOK_SOCIAL_MEDIA_TYPE, INSTAGRAM_SOCIAL_MEDIA_TYPE, LINKEDIN_SOCIAL_MEDIA_TYPE, PHONE_MEDIA_TYPE,
  TWITTER_X_SOCIAL_MEDIA_TYPE
} from './constant'

const ContactCard = ({ contact }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  return (
    <div className="relative py-20">
      <div className="rounded overflow-hidden shadow-md">
        <div className="absolute -mt-20 w-full flex justify-center">
          <div className="h-32 w-32">
            {contact?.imageFile &&
              <img
                alt={format('image.alt.logoFor', { name: format('ui.contact.name.label') })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + contact.imageFile}
                className="rounded-full object-cover h-full w-full"
              />
            }
            {!contact?.imageFile &&
              <img
                alt={format('image.alt.logoFor', { name: format('ui.contact.name.label') })}
                src='/ui/v1/user-header.svg'
                className="rounded-full object-cover h-full w-full"
              />
            }
          </div>
        </div>
        <div className="mt-16">
          <div className="font-bold text-3xl text-center mb-1">
            {`${contact?.name ?? 'First+Last Name'}`}
          </div>
          <p className="text-sm text-center">
            {`${contact?.title ?? 'Title of Contact'}`}
          </p>
          <div className="flex justify-center pt-6 pb-6">
            {contact?.socialNetworkingServices.map((service, index) => (
              service.name === PHONE_MEDIA_TYPE
                ? <a
                  key={index}
                  href={`tel:${service.value}`}
                  className="mx-5"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaSquarePhone size='1.5rem' />
                </a>
                :
                <a
                  key={index}
                  href={`//${service.value}`}
                  className="mx-5"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div aria-label={service.name}>
                    {service.name === LINKEDIN_SOCIAL_MEDIA_TYPE ? <FaLinkedin size='1.5rem' /> : null}
                    {service.name === TWITTER_X_SOCIAL_MEDIA_TYPE ? <FaSquareXTwitter size='1.5rem' /> : null}
                    {service.name === INSTAGRAM_SOCIAL_MEDIA_TYPE ? <FaSquareInstagram size='1.5rem' /> : null}
                    {service.name === FACEBOOK_SOCIAL_MEDIA_TYPE ? <FaSquareFacebook size='1.5rem' /> : null}
                  </div>
                </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactCard
