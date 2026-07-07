import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const features = [
  {
    title: 'Reconhecimento',
    text: 'Nossa trajetória é solidificada pela confiança, pelo zelo e dedicação em cada trabalho entregue e por trazer resultados concretos às pessoas.',
  },
  {
    title: 'Produtos acessíveis',
    text: 'Serviços pagos e gratuitos de plugins, mapas, websites, configurações, texturas, bots para Discord, APIs, painéis, integrações e ferramentas.',
  },
  {
    title: 'Qualidade imbatível',
    text: 'Trabalhamos com um padrão premium, focando em qualidade — não quantidade — e oferecendo versões gratuitas. Um diferencial real no mercado.',
  },
  {
    title: 'Suporte inigualável',
    text: 'Com uma equipe eficiente de segunda a sexta-feira, nos tornamos o atendimento mais rápido do mercado.',
  },
]

export default function Home() {
  const [stats, setStats] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <>
      <section className="hero container">
        <span className="badge">● Nova geração de plugins premium</span>
        <h1>
          Seguimos fortes em plugins. Agora, com espaço para{' '}
          <span className="gradient-text">irmos além.</span>
        </h1>
        <p className="lead">
          A NewPlugins é a evolução da Leaf Plugins. Mudamos para um estúdio
          criativo porque crescemos, sem abandonar o que nos fez diferentes:
          qualidade, profissionalismo e impacto real no dia a dia de cada pessoa.
        </p>

        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="value">
                  {s.value}
                  <span className="gradient-text">{s.suffix}</span>
                </div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <Link to="/products" className="btn">Ver produtos</Link>
          <Link to="/plans" className="btn secondary">Conhecer planos</Link>
        </div>
      </section>

      <section className="section container">
        <h2>Por que escolher a NewPlugins</h2>
        <p className="sub">
          Produtos pensados para quem leva a sério a experiência da comunidade.
        </p>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
