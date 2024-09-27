import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaXmark } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useMutation } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import { UPDATE_SITE_SETTING_HERO_CARD_CONFIGURATIONS } from '../../shared/mutation/siteSetting'

const DeleteHeroCardConfiguration = (props) => {
  const { siteSettingSlug, heroCardConfiguration, heroCardSection, setHeroCardSection } = props

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const { user } = useUser()

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [mutating, setMutating] = useState(false)

  const { locale } = useRouter()
  const [bulkUpdateHeroCard, { reset }] = useMutation(UPDATE_SITE_SETTING_HERO_CARD_CONFIGURATIONS, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setDisplayConfirmDialog(false)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      const { updateSiteSettingHeroCardConfigurations: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.heroCardConfigurations.submitted' />)
        setHeroCardSection([...response.siteSetting.heroCardSection])
        setDisplayConfirmDialog(false)
        setMutating(false)
      } else {
        const [ firstErrorMessage ] = response.errors
        showFailureMessage(firstErrorMessage)
        setDisplayConfirmDialog(false)
        setMutating(false)
        reset()
      }
    }
  })

  const executeBulkUpdate = () => {
    if (user) {
      setMutating(true)
      const currentHeroCardConfigurations = [...heroCardSection.heroCardConfigurations]
      // Try to find the index in the top level heroCard configurations
      let indexOfHeroCardConfiguration = currentHeroCardConfigurations.findIndex(m => m.id === heroCardConfiguration.id)
      if (indexOfHeroCardConfiguration >= 0) {
        // Remove the heroCard configuration from the current heroCard configurations
        currentHeroCardConfigurations.splice(indexOfHeroCardConfiguration, 1)
      }

      const { userEmail, userToken } = user
      const variables = {
        siteSettingSlug,
        heroCardTitle: heroCardConfiguration.title,
        heroCardDescription: heroCardConfiguration.description,
        heroCardConfigurations: currentHeroCardConfigurations
      }

      bulkUpdateHeroCard({
        variables,
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={toggleConfirmDialog}
        className='bg-white px-2 py-1 rounded'
      >
        <div className='text-sm flex gap-1 text-red-500'>
          <FaXmark className='my-auto' />
          <FormattedMessage id='app.delete' />
        </div>
      </button>
      <ConfirmActionDialog
        title='ui.siteSetting.heroCard.deleteHeroCard'
        message='ui.siteSetting.heroCard.deleteHeroCardDescription'
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={executeBulkUpdate}
        isConfirming={mutating}
      />
    </>
  )
}

export default DeleteHeroCardConfiguration
