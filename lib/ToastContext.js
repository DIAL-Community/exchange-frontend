import { createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Slide, toast, ToastContainer } from 'react-toastify'

const AUTO_CLOSE_DELAY = 1000
const DEFAULT_AUTO_CLOSE_DELAY = 500

const ToastContext = createContext()
const ToastContextProvider = ({ children }) => {
  const router = useRouter()

  const toastType = (typeHint = '') => {
    return typeHint ?? 'default'
  }

  const toastPosition = (positionHint = '') => {
    return positionHint ?? 'top-right'
  }

  const showSuccessMessage = (message, onCloseCallback) =>
    toast(message, {
      toastId: 'toastId',
      position: 'top-center',
      type: 'success',
      onClose: onCloseCallback,
      autoClose: AUTO_CLOSE_DELAY
    })

  const showFailureMessage = (message, onCloseCallback) =>
    toast(message, {
      toastId: 'toastId',
      position: 'top-center',
      type: 'error',
      onClose: onCloseCallback,
      autoClose: AUTO_CLOSE_DELAY
    })

  const showToast = (
    message,
    typeHint,
    positionHint,
    autoClose = DEFAULT_AUTO_CLOSE_DELAY,
    onOpenCallback,
    onCloseCallback
  ) => {
    toast(message, {
      toastId: 'toastId',
      type: toastType(typeHint),
      position: toastPosition(positionHint),
      autoClose,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onOpen: onOpenCallback,
      onClose: onCloseCallback
    })
  }

  useEffect(() => {
    const handleRouteChange = () => {
      toast.dismiss()
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const props = { showToast, showSuccessMessage, showFailureMessage }

  return (
    <ToastContext.Provider value={{ ...props }}>
      <ToastContainer transition={Slide} style={{ width: 'auto' }} />
      {children}
    </ToastContext.Provider>
  )
}

export { ToastContextProvider, ToastContext, DEFAULT_AUTO_CLOSE_DELAY }
