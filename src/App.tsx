import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { TimelinePage } from '@/pages/TimelinePage';
import { NewRecordPage } from '@/pages/NewRecordPage';
import { EditRecordPage } from '@/pages/EditRecordPage';
import { StatisticsPage } from '@/pages/StatisticsPage';
import { FishGuidePage } from '@/pages/FishGuidePage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SettingsPage } from '@/pages/SettingsPage';

/** 路由配置 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TimelinePage />} />
          <Route path="/new" element={<NewRecordPage />} />
          <Route path="/edit/:id" element={<EditRecordPage />} />
          <Route path="/统计" element={<StatisticsPage />} />
          <Route path="/图鉴" element={<FishGuidePage />} />
          <Route path="/收藏" element={<FavoritesPage />} />
          <Route path="/设置" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
