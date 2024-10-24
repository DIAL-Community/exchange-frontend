import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { FaXmark } from 'react-icons/fa6'
import { FormattedMessage } from 'react-intl'
import { useMutation } from '@apollo/client'
import { ToastContext } from '../../../lib/ToastContext'
import ConfirmActionDialog from '../../shared/form/ConfirmActionDialog'
import { UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATIONS } from '../../shared/mutation/siteSetting'

const DeleteCarouselConfiguration = (props) => {
  const { siteSettingSlug, carouselConfiguration, carouselConfigurations, setCarouselConfigurations } = props

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false)
  const toggleConfirmDialog = () => setDisplayConfirmDialog(!displayConfirmDialog)

  const [mutating, setMutating] = useState(false)

  const { locale } = useRouter()
  const [bulkUpdateCarousel, { reset }] = useMutation(UPDATE_SITE_SETTING_CAROUSEL_CONFIGURATIONS, {
    onError: (error) => {
      showFailureMessage(error?.message)
      setDisplayConfirmDialog(false)
      setMutating(false)
      reset()
    },
    onCompleted: (data) => {
      const { updateSiteSettingCarouselConfigurations: response } = data
      if (response.errors.length === 0 && response.siteSetting) {
        showSuccessMessage(<FormattedMessage id='ui.siteSetting.carouselConfigurations.submitted' />)
        setCarouselConfigurations([...response.siteSetting.carouselConfigurations])
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
    setMutating(true)
    const currentCarouselConfigurations = [...carouselConfigurations]
    // Try to find the index in the top level carousel configurations
    let indexOfCarouselConfiguration = carouselConfigurations.findIndex(m => m.id === carouselConfiguration.id)
    if (indexOfCarouselConfiguration >= 0) {
      // Remove the carousel configuration from the current carousel configurations
      currentCarouselConfigurations.splice(indexOfCarouselConfiguration, 1)
    } else {
      // Try finding the id to be deleted in the carousel item configurations
      indexOfCarouselConfiguration = carouselConfigurations.findIndex(m => {
        return m.carouselItemConfigurations.findIndex(mi => mi.id === carouselConfiguration.id) >= 0
      })
      const existingParentCarousel = currentCarouselConfigurations[indexOfCarouselConfiguration]
      // Rebuild the parent carousel configuration without the carousel item configuration
      const currentParentCarousel = {
        ...existingParentCarousel,
        carouselItemConfigurations: [
          ...existingParentCarousel.carouselItemConfigurations.filter(mi => mi.id !== carouselConfiguration.id)
        ]
      }
      currentCarouselConfigurations[indexOfCarouselConfiguration] = currentParentCarousel
    }

    const variables = {
      siteSettingSlug,
      carouselConfigurations: currentCarouselConfigurations
    }

    bulkUpdateCarousel({
      variables,
      context: {
        headers: {
          'Accept-Language': locale
        }
      }
    })
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
        title={<FormattedMessage id='ui.siteSetting.carousel.deleteCarousel' />}
        message={< FormattedMessage id='ui.siteSetting.carousel.deleteCarouselDescription' />}
        isOpen={displayConfirmDialog}
        onClose={toggleConfirmDialog}
        onConfirm={executeBulkUpdate}
        isConfirming={mutating}
      />
    </>
  )
}

export default DeleteCarouselConfiguration
