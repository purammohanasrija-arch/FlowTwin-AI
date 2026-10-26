import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/authContext.js';
import { AppShell } from './components/layout/AppShell.js';
import { LandingPage } from './features/landing/LandingPage.js';
import { LoginPage } from './features/auth/LoginPage.js';

// ChocoFlow AI Core Modules
import { ChocolateOverviewPage } from './features/factory/ChocolateOverviewPage.js';
import { ProductionWorkflowPage } from './features/factory/ProductionWorkflowPage.js';
import { RawMaterialsPage } from './features/factory/RawMaterialsPage.js';
import { QualityScannerPage } from './features/factory/QualityScannerPage.js';
import { WarehouseStoragePage } from './features/factory/WarehouseStoragePage.js';
import { FactoryDeliveriesPage } from './features/factory/FactoryDeliveriesPage.js';
import { ProblemSimulatorPage } from './features/factory/ProblemSimulatorPage.js';
import { ComparePlansPage } from './features/factory/ComparePlansPage.js';
import { AskChocoFlowPage } from './features/factory/AskChocoFlowPage.js';
import { FactoryParametersPage } from './features/factory/FactoryParametersPage.js';

// Code-split 3D Factory Canvas
const ChocolateFactoryCanvas = lazy(() => import('./features/factory/3d/ChocolateFactoryCanvas.js'));

// Preserved Logistics Subsystems
const LogisticsMapPage = lazy(() =>
  import('./features/map/LogisticsMapPage.js').then(m => ({ default: m.LogisticsMapPage }))
);
const ShipmentsPage = lazy(() =>
  import('./features/shipments/ShipmentsPage.js').then(m => ({ default: m.ShipmentsPage }))
);
const AlertsPage = lazy(() =>
  import('./features/alerts/AlertsPage.js').then(m => ({ default: m.AlertsPage }))
);
const AnalyticsStudioPage = lazy(() =>
  import('./features/analytics/AnalyticsStudioPage.js').then(m => ({ default: m.AnalyticsStudioPage }))
);
const AdminAuditPage = lazy(() =>
  import('./features/admin/AdminAuditPage.js').then(m => ({ default: m.AdminAuditPage }))
);

const ViewLoadingFallback = () => (
  <div className="flex items-center justify-center h-[70vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-amber-300 rounded-full animate-spin" />
      <span className="text-xs text-amber-200/80 font-mono tracking-wider">
        LOADING CHOCOFLOW FACTORY TELEMETRY...
      </span>
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

            {/* Authenticated ChocoFlow Application Shell */}
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              
              {/* Main Factory Navigation */}
              <Route path="dashboard" element={<ChocolateOverviewPage />} />
              <Route
                path="twin-3d"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <ChocolateFactoryCanvas />
                  </Suspense>
                }
              />
              <Route path="production" element={<ProductionWorkflowPage />} />
              <Route path="materials" element={<RawMaterialsPage />} />
              <Route path="quality" element={<QualityScannerPage />} />
              <Route path="warehouse" element={<WarehouseStoragePage />} />
              <Route path="deliveries" element={<FactoryDeliveriesPage />} />
              <Route path="problems" element={<ProblemSimulatorPage />} />
              <Route path="plans" element={<ComparePlansPage />} />
              <Route path="ask" element={<AskChocoFlowPage />} />
              <Route path="parameters" element={<FactoryParametersPage />} />

              {/* Preserved Logistics Views */}
              <Route
                path="map"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <LogisticsMapPage />
                  </Suspense>
                }
              />
              <Route
                path="shipments"
                element={
                  <Suspense fallback={<ViewLoadingFallback />}>
                    <ShipmentsPage />
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

              {/* Backward-compatibility aliases */}
              <Route path="simulations" element={<Navigate to="/app/problems" replace />} />
              <Route path="recovery" element={<Navigate to="/app/plans" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
