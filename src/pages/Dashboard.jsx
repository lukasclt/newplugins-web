import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Área do Cliente</h1>
        <p>Acesse suas licenças, assinaturas e produtos adquiridos.</p>
      </div>

      <div className="util-box" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)', marginBottom: 18 }}>
          Esta é uma demonstração da área do cliente. Faça login para visualizar
          suas licenças emitidas e gerenciar seus planos.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn">Entrar</button>
          <Link to="/plans" className="btn secondary">Ver planos</Link>
        </div>
      </div>
    </div>
  )
}
