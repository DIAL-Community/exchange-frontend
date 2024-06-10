export const DEFAULT_PAGE_SIZE = 5

export const FACEBOOK_SOCIAL_MEDIA_TYPE = 'facebook'
export const LINKEDIN_SOCIAL_MEDIA_TYPE = 'linkedin'
export const INSTAGRAM_SOCIAL_MEDIA_TYPE = 'instagram'
export const TWITTER_X_SOCIAL_MEDIA_TYPE = 'twitter'
export const PHONE_MEDIA_TYPE = 'phone'

export const generateSnsTypeOptions = (format) => {
  return [
    { label: format('ui.contact.snsType.facebook'), value: FACEBOOK_SOCIAL_MEDIA_TYPE },
    { label: format('ui.contact.snsType.instagram'), value: INSTAGRAM_SOCIAL_MEDIA_TYPE },
    { label: format('ui.contact.snsType.linkedin'), value: LINKEDIN_SOCIAL_MEDIA_TYPE },
    { label: format('ui.contact.snsType.phone'), value: PHONE_MEDIA_TYPE },
    { label: format('ui.contact.snsType.twitter'), value: TWITTER_X_SOCIAL_MEDIA_TYPE }
  ]
}

export const findSnsType = (snsTypeValue, format) => {
  return generateSnsTypeOptions(format).find(({ value }) => {
    return value === snsTypeValue
  })
}
