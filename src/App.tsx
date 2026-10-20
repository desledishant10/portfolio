import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { BootLoader } from './components/BootLoader';
import { ScrollProgress } from './components/ScrollProgress';
import { CRTOverlay } from './components/CRTOverlay';
import { CommandPalette } from './components/CommandPalette';
import { KonamiListener } from './components/KonamiListener';
import { MatrixRain } from './components/MatrixRain';
import HomePage from './routes/HomePage';
import NotFoundPage from './routes/NotFoundPage';

// The /admin SOC console is a heavy easter egg (attack map, ATT&CK matrix, feed
// engine). Lazy-load it so none of that ships in the main bundle.
const AdminPage = lazy(() => import('./routes/AdminPage'));

function App() {
  const { pathname } = useLocation();
  // Lighter matrix on /admin and /404 so the foreground content still pops there.
  const opacity = pathname === '/' ? 0.22 : 0.1;

  return (
    <>
      <MatrixRain opacity={opacity} />
      <BootLoader />
      <ScrollProgress />
      <CRTOverlay />
      <CommandPalette />
      <KonamiListener />
      <Suspense fallback={<div className="min-h-screen" aria-hidden />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Analytics />
    </>
  );
}

export default App;
