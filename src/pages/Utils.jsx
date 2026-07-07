import { useState } from 'react'
import { api } from '../api.js'

export default function Utils() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.generateText(prompt)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>Gerador de Texto</h1>
        <p>Utilitário de demonstração que gera sugestões a partir de um prompt.</p>
      </div>

      <form className="util-box" onSubmit={handleSubmit}>
        <textarea
          placeholder="Descreva o que você precisa, ex.: slogan para servidor de survival..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div style={{ marginTop: 14 }}>
          <button className="btn" disabled={loading || !prompt.trim()}>
            {loading ? 'Gerando...' : 'Gerar texto'}
          </button>
        </div>

        {error && <div className="error" style={{ marginTop: 16 }}>{error}</div>}
        {result && <div className="result">{result.text}</div>}
      </form>
    </div>
  )
}
