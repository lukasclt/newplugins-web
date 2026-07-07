import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 12 }}>
              <span className="leaf">❦</span>
              NewPlugins
            </div>
            <p style={{ color: 'var(--text-dim)', maxWidth: 320 }}>
              Há 4 anos redefinindo os padrões do mercado com excelência.
              Soluções criativas, sistemas e design para projetos que querem
              sair do improviso.
            </p>
            <div className="socials">
              <a href="https://discord.com" target="_blank" rel="noreferrer" aria-label="Discord">💬</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
            </div>
          </div>

          <div>
            <h4>Informações</h4>
            <a href="https://docs.leafdelta.com" target="_blank" rel="noreferrer">Documentação</a>
            <a href="https://docs.leafdelta.com/docs/introducao/termos" target="_blank" rel="noreferrer">Termos de Serviço</a>
            <a href="https://docs.leafdelta.com/docs/introducao/desenvolvimento" target="_blank" rel="noreferrer">API para Desenvolvedores</a>
            <Link to="/team">Nossa equipe</Link>
          </div>

          <div>
            <h4>Redes Sociais</h4>
            <a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2022–2026 Todos os direitos reservados</span>
          <span>CNPJ: 57.222.714/0001-61 · FLAVIO SOARES</span>
        </div>
      </div>
    </footer>
  )
}
