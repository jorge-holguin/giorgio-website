import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import GitHubProjects from '@/components/sections/GitHubProjects'
import TechStack from '@/components/sections/TechStack'
import Content from '@/components/sections/Content'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <GitHubProjects />
        <TechStack />
        <Content />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
