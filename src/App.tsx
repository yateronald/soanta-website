import { Routes, Route } from 'react-router-dom'
import SEO from './components/SEO/SEO'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Services from './components/Services/Services'
import Products from './components/Products/Products'
import Partnerships from './components/Partnerships/Partnerships'
import About from './components/About/About'
import ContactForm from './components/ContactForm/ContactForm'
import Footer from './components/Footer/Footer'
import { AuthProvider } from './admin/context/AuthContext'
import { ProtectedRoute } from './admin/components/ProtectedRoute'
import { Layout } from './admin/components/Layout/Layout'
import { LoginPage } from './admin/pages/LoginPage'
import { DemandesPage } from './admin/pages/DemandesPage'
import { UsersPage } from './admin/pages/UsersPage'
import { DeletedRecordsPage } from './admin/pages/DeletedRecordsPage'
import './App.css'

function LandingPage() {
  return (
    <>
      <SEO />
      <Header />
      <main>
        <Hero />
        <Services />
        <Products />
        <Partnerships />
        <About />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DemandesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="deleted" element={<DeletedRecordsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
