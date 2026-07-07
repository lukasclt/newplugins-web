import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Plans from './pages/Plans.jsx'
import Market from './pages/Market.jsx'
import Team from './pages/Team.jsx'
import Utils from './pages/Utils.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/market" element={<Market />} />
          <Route path="/team" element={<Team />} />
          <Route path="/utils/generate-text" element={<Utils />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
