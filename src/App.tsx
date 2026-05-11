import { Route, Routes, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { BootLoader } from './components/BootLoader';
import { ScrollProgress } from './components/ScrollProgress';
import { CRTOverlay } from './components/CRTOverlay';
import { CommandPalette } from './components/CommandPalette';
import { KonamiListener } from './components/KonamiListener';
import { MatrixRain } from './components/MatrixRain';
import HomePage from './routes/HomePage';
import AdminPage from './routes/AdminPage';
import NotFoundPage from './routes/NotFoundPage';

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
