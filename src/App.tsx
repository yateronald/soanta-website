import SEO from './components/SEO/SEO'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Services from './components/Services/Services'
import Products from './components/Products/Products'
import Partnerships from './components/Partnerships/Partnerships'
import About from './components/About/About'
import ContactForm from './components/ContactForm/ContactForm'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
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

export default App
