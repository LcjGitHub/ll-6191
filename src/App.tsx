import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TimelinePage } from '@/pages/TimelinePage';
import { NewRecordPage } from '@/pages/NewRecordPage';
import { StatisticsPage } from '@/pages/StatisticsPage';

/** 路由配置 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TimelinePage />} />
          <Route path="/new" element={<NewRecordPage />} />
          <Route path="/统计" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
