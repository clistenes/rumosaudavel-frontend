'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h2 className="mb-3">Algo deu errado!</h2>
        <p className="text-muted mb-4">{error.message}</p>
        <button className="btn btn-primary" onClick={reset}>
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
