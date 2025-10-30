import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/layout/MainLayout';
import { PageLoading } from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/home/ModernHomePage'));
const GeneratorPage = lazy(() => import('./pages/generator/GeneratorPage'));
const TemplatesPage = lazy(() => import('./pages/templates/TemplatesPage'));
const ConfigPage = lazy(() => import('./pages/config/ConfigPage'));

/**
 * 使用懒加载优化的 App 组件
 */
const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AppProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Suspense fallback={<PageLoading />}>
                            <Routes>
                                <Route path='/' element={<HomePage />} />
                                <Route path='/generator' element={<GeneratorPage />} />
                                <Route path='/templates' element={<TemplatesPage />} />
                                <Route path='/config' element={<ConfigPage />} />
                                <Route path='*' element={<Navigate to='/' replace />} />
                            </Routes>
                        </Suspense>
                    </MainLayout>
                </BrowserRouter>
            </AppProvider>
        </ErrorBoundary>
    );
};

export default App;
