import { ToastContainer, Slide, toast } from 'react-toastify'
import { createContext, useEffect } from 'react'
import { useRouter } from 'next/router'

const DEFAULT_AUTO_CLOSE_DELAY = 500

const ToastContext = createContext()
const ToastContextProvider = ({ children }) => {
  const router = useRouter()

  const toastType = (typeHint = '') => {
    switch (typeHint) {
    case 'info':
      return toast.TYPE.INFO
    case 'error':
      return toast.TYPE.ERROR
    case 'success':
      return toast.TYPE.SUCCESS
    default:
      return toast.TYPE.DEFAULT
    }
  }

  const toastPosition = (positionHint = '') => {
    switch (positionHint) {
    case 'top-right':
      return toast.POSITION.TOP_RIGHT
    case 'top-center':
      return toast.POSITION.TOP_CENTER
    case 'top-left':
      return toast.POSITION.TOP_LEFT
    case 'bottom-right':
      return toast.POSITION.BOTTOM_RIGHT
    case 'bottom-left':
      return toast.POSITION.BOTTOM_LEFT
    default:
      return toast.POSITION.TOP_RIGHT
    }
  }

  const showToast = (message, typeHint, positionHint, autoClose = DEFAULT_AUTO_CLOSE_DELAY, onOpenCallback, onCloseCallback) => {
    toast(message, {
      type: toastType(typeHint),
      position: toastPosition(positionHint),
      autoClose: autoClose,
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

  const props = { showToast }

  return (
    <ToastContext.Provider value={{ ...props }}>
      <ToastContainer transition={Slide} style={{ width: 'auto' }} />
      {children}
    </ToastContext.Provider>
  )
}

export { ToastContextProvider, ToastContext, DEFAULT_AUTO_CLOSE_DELAY }
