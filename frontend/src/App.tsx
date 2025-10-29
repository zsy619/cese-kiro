import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/home/HomePage';
import GeneratorPage from './pages/generator/GeneratorPage';
import TemplatesPage from './pages/templates/TemplatesPage';
import ConfigPage from './pages/config/ConfigPage';
import { antdTheme } from './styles/theme';
import './styles/global.css';

function App() {
  return (
    <ConfigProvider 
      locale={zhCN}
      theme={antdTheme}
    >
      <AppProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/config" element={<ConfigPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </AppProvider>
    </ConfigProvider>
  );
}

export default App;
