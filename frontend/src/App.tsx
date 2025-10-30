import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AppProvider } from './contexts/AppContext';
import SeceLayout from './components/layout/SeceLayout';
import SeceHomePage from './pages/home/SeceHomePage';
import GeneratorPage from './pages/generator/GeneratorPage';
import TemplatesPage from './pages/templates/TemplatesPage';
import ConfigPage from './pages/config/ConfigPage';
import { ErrorBoundary } from './components/common';
import { antdTheme } from './styles/theme';
import './styles/global.css';
import './styles/animations.css';

function App() {
    return (
        <ErrorBoundary>
            <ConfigProvider
                locale={zhCN}
                theme={antdTheme}
            >
                <AppProvider>
                    <Router>
                        <SeceLayout>
                            <Routes>
                                <Route path="/" element={<SeceHomePage />} />
                                <Route path="/generator" element={<GeneratorPage />} />
                                <Route path="/templates" element={<TemplatesPage />} />
                                <Route path="/config" element={<ConfigPage />} />
                            </Routes>
                        </SeceLayout>
                    </Router>
                </AppProvider>
            </ConfigProvider>
        </ErrorBoundary>
    );
}

export default App;
