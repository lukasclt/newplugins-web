import { useEffect, useState } from 'react'
import { api } from '../api.js'

const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getTeam()
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <div className="page-head">
        <h1>Pessoas que cuidam da NewPlugins</h1>
        <p>
          Conheça quem desenvolve, atende, modera e mantém os produtos e a
          comunidade funcionando.
        </p>
      </div>

      {loading && <div className="loading">Carregando equipe...</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        {members.map((m) => (
          <div className="member" key={m.id}>
            <div className="avatar" style={{ background: m.avatar_color }}>
              {initials(m.name)}
            </div>
            <h3>{m.name}</h3>
            <span className="role">{m.role}</span>
            <p>{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
