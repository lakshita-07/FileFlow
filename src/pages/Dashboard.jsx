import { Link } from "react-router-dom"

const tools = [
  {
    name: "Smart Scan",
    description:
      "Scan documents with automatic detection, manual corner correction and live enhancement.",
    path: "/smart-scan",
    icon: "⌕",
  },
  {
    name: "Convert",
    description:
      "Convert images between JPG, PNG, WebP, and PDF.",
    path: "/convert",
    icon: "⇄",
  },
  {
    name: "Compress",
    description:
      "Reduce file size while preserving useful quality.",
    path: "/compress",
    icon: "↓",
  },
  {
    name: "Resize",
    description:
      "Resize images by dimensions or percentage.",
    path: "/resize",
    icon: "↗",
  },
  {
    name: "PDF Tools",
    description:
      "Merge, extract, and rotate PDF pages.",
    path: "/pdf-tools",
    icon: "▤",
  },
]

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10">

      <section className="mb-14 max-w-3xl">
        <p className="mb-4 inline-flex rounded-full border border-outline-variant bg-surface px-4 py-2 text-sm font-semibold text-primary">
          ZERO DATA COLLECTION
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-primary-heading leading-tight">
          Professional File Utilities,
          <br />
          Privately in your Browser.
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-on-surface-variant leading-8">
          No uploads, no accounts, 100% local processing.
          Your files never leave your device.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group rounded-xl border border-outline-variant bg-surface p-6 text-left transition hover:-translate-y-1 hover:border-primary"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container text-xl text-primary">
              {tool.icon}
            </div>

            <h2 className="text-xl font-bold text-primary-heading">
              {tool.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              {tool.description}
            </p>

            <div className="mt-5 text-sm font-bold text-primary">
              Open tool →
            </div>
          </Link>
        ))}

        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-6 opacity-60">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container text-xl">
            ✦
          </div>

          <h2 className="text-xl font-bold text-primary-heading">
            Smart Organize
          </h2>

          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            AI-assisted local file organization.
          </p>

          <div className="mt-5 text-xs font-bold uppercase tracking-wider text-secondary">
            Coming Soon
          </div>
        </div>
      </section>

    </main>
  )
}
