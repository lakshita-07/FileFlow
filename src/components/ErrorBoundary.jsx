import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="max-w-md rounded-xl border border-outline-variant bg-surface p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-2xl">
              !
            </div>

            <h2 className="text-xl font-bold text-primary-heading">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-on-surface-variant">
              An unexpected error occurred while processing. Please try refreshing the page.
            </p>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="mt-5 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
