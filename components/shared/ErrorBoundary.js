import { Component } from 'react'
import { InternalServerError } from './FetchStatus'
import Footer from './Footer'
import Header from './Header'

// Based on https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    console.log('Derived state from error: ', error)

    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Report error to logging service like datadog, backend error api, etc.
    console.log({ error, errorInfo })
  }

  render() {
    // Check if state have error and render custom fallback UI.
    if (this.state.hasError) {
      return (
        <div className='max-w-catalog mx-auto'>
          <Header />
          <InternalServerError />
          <Footer />
        </div>
      )
    }

    // Return children components in case of no error
    return this.props.children
  }
}

export default ErrorBoundary
