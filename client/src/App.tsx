import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/authContext.js';
import { AppShell } from './components/layout/AppShell.js';
import { LandingPage } from './features/landing/LandingPage.js';
import { LoginPage } from './features/auth/LoginPage.js';
import { ControlTowerPage } from './features/dashboard/ControlTowerPage.js';
import { ShipmentsPage } from './features/shipments/ShipmentsPage.js';
import { DocumentIntelligencePage } from './features/documents/DocumentIntelligencePage.js';

// Heavy modules code-split on demand for lightning-fast initial load
const LogisticsDigitalTwin3D = lazy(() => import('./features/digitaltwin3d/LogisticsDigitalTwin3D.js'));
const LogisticsMapPage = lazy(() => import('./features/map/LogisticsMapPage.js').then(m => ({ default: m.LogisticsMapPage })));
const DigitalTwinPage = lazy(() => import('./features/network/DigitalTwinPage.js').then(m => ({ default: m.DigitalTwinPage })));
const DisruptionLabPage = lazy(() => import('./features/simulations/DisruptionLabPage.js').then(m => ({ default: m.DisruptionLabPage })));
const RecoveryPlannerPage = lazy(() => import('./features/recovery/RecoveryPlannerPage.js').then(m => ({ default: m.RecoveryPlannerPage })));
const AlertsPage = lazy(() => import('./features/alerts/AlertsPage.js').then(m => ({ default: m.AlertsPage })));
const AnalyticsStudioPage = lazy(() => import('./features/analytics/AnalyticsStudioPage.js').then(m => ({ default: m.AnalyticsStudioPage })));
const AdminAuditPage = lazy(() => import('./features/admin/AdminAuditPage.js').then(m => ({ default: m.AdminAuditPage })));

const ViewLoadingFallback = () => (
  <div className="flex items-center justify-center h-[70vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-cyan-400 rounded-full animate-spin" />
      <span className="text-xs text-gray-400 font-mono tracking-wider">LOADING TELEMETRY VIEW...</span>
    </div>
  </div>
);

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Application Shell */}
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<ControlTowerPage />} />
              <Route path="shipments" element={<ShipmentsPage />} />
              <Route path="documents" element={<DocumentIntelligencePage />} />

              {/* Code-split routes wrapped in Suspense */}
              <Route
                path="twin-3d"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <LogisticsDigitalTwin3D />
                  </Suspense>
                }
              />
              <Route
                path="map"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <LogisticsMapPage />
                  </Suspense>
                }
              />
              <Route
                path="network"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <DigitalTwinPage />
                  </Suspense>
                }
              />
              <Route
                path="simulations"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <DisruptionLabPage />
                  </Suspense>
                }
              />
              <Route
                path="recovery"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <RecoveryPlannerPage />
                  </Suspense>
                }
              />
              <Route
                path="alerts"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <AlertsPage />
                  </Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <AnalyticsStudioPage />
                  </Suspense>
                }
              />
              <Route
                path="admin"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <AdminAuditPage />
                  </Suspense>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};
