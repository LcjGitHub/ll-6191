import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TimelinePage } from '@/pages/TimelinePage';
import { NewRecordPage } from '@/pages/NewRecordPage';

/** 路由配置 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TimelinePage />} />
          <Route path="/new" element={<NewRecordPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
