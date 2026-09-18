export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />

      <p className="text-sm font-medium text-on-surface-variant">
        {message}
      </p>
    </div>
  )
}
