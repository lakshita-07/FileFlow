import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ErrorBoundary from "./components/ErrorBoundary"
import Loading from "./components/Loading"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const SmartScan = lazy(() => import("./pages/SmartScan"))
const Convert = lazy(() => import("./pages/Convert"))
const SmartCompress = lazy(() => import("./pages/SmartCompress"))
const Resize = lazy(() => import("./pages/Resize"))
const PDFTools = lazy(() => import("./pages/PDFTools"))

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        <ErrorBoundary>
          <Suspense fallback={<Loading message="Loading tool..." />}>
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />
              <Route
                path="/smart-scan"
                element={<SmartScan />}
              />
              <Route
                path="/convert"
                element={<Convert />}
              />
              <Route
                path="/compress"
                element={<SmartCompress />}
              />
              <Route
                path="/resize"
                element={<Resize />}
              />
              <Route
                path="/pdf-tools"
                element={<PDFTools />}
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>

        <footer className="border-t border-outline-variant bg-surface py-6">
          <div className="mx-auto max-w-[1280px] px-5 text-center text-xs text-on-surface-variant lg:px-10">
            FileFlow — All files are processed locally in your browser. Nothing is uploaded.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
