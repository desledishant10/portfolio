import { MatrixRain } from './components/MatrixRain';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Competitions } from './components/Competitions';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BootLoader } from './components/BootLoader';
import { ScrollProgress } from './components/ScrollProgress';
import { CRTOverlay } from './components/CRTOverlay';

function App() {
  return (
    <>
      <BootLoader />
      <ScrollProgress />
      <CRTOverlay />
      <MatrixRain opacity={0.16} />
      <Nav />
      <main>
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

export default App;
