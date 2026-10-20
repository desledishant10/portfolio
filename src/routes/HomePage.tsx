import { Nav } from '../components/Nav';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Experience } from '../components/Experience';
import { Projects } from '../components/Projects';
import { Competitions } from '../components/Competitions';
import { Certifications } from '../components/Certifications';
import { Education } from '../components/Education';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-3 focus:py-2 focus:rounded-sm focus:bg-neon-cyan focus:text-bg focus:font-mono focus:text-sm"
      >
        skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-hidden">
        <Hero />
        <About />
        <Skills />
        <Education />
        <Experience />
        <Projects />
        <Competitions />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
