'use client'

export default function Page() {
  return (
    <iframe
      src="/index.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        display: 'block',
      }}
      title="Smart Task Manager"
    />
  )
}
