import { Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { BootLoader } from './components/BootLoader';
import { ScrollProgress } from './components/ScrollProgress';
import { CRTOverlay } from './components/CRTOverlay';
import { CommandPalette } from './components/CommandPalette';
import { KonamiListener } from './components/KonamiListener';
import HomePage from './routes/HomePage';
import AdminPage from './routes/AdminPage';
import NotFoundPage from './routes/NotFoundPage';

function App() {
  return (
    <>
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
