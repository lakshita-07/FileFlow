import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

const links = [
  ["Dashboard", "/"],
  ["Smart Scan", "/smart-scan"],
  ["Convert", "/convert"],
  ["Compress", "/compress"],
  ["Resize", "/resize"],
  ["PDF Tools", "/pdf-tools"],
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 lg:px-10">

        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-white">
            F
          </div>

          <span className="text-xl font-bold text-primary">
            FileFlow
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([name, path]) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium transition ${
                location.pathname === path
                  ? "font-bold text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>

        <div className="hidden rounded-full border border-outline-variant px-4 py-2 text-xs font-semibold text-primary md:block">
          ✓ 100% Private
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-lg">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>

      </div>

      {menuOpen && (
        <nav className="border-t border-outline-variant bg-background md:hidden">
          <div className="mx-auto max-w-[1280px] px-5 py-3">
            {links.map(([name, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  location.pathname === path
                    ? "bg-secondary-container font-bold text-primary"
                    : "text-on-surface-variant hover:bg-surface"
                }`}
              >
                {name}
              </Link>
            ))}

            <div className="mt-2 rounded-lg px-4 py-3 text-xs font-semibold text-primary">
              ✓ 100% Private — Files never leave your device
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
