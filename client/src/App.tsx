import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/authContext.js';
import { AppShell } from './components/layout/AppShell.js';
import { LandingPage } from './features/landing/LandingPage.js';
import { LoginPage } from './features/auth/LoginPage.js';
import { ControlTowerPage } from './features/dashboard/ControlTowerPage.js';
import { LogisticsDigitalTwin3D } from './features/digitaltwin3d/LogisticsDigitalTwin3D.js';
import { LogisticsMapPage } from './features/map/LogisticsMapPage.js';
import { ShipmentsPage } from './features/shipments/ShipmentsPage.js';
import { DocumentIntelligencePage } from './features/documents/DocumentIntelligencePage.js';
import { DigitalTwinPage } from './features/network/DigitalTwinPage.js';
import { DisruptionLabPage } from './features/simulations/DisruptionLabPage.js';
import { RecoveryPlannerPage } from './features/recovery/RecoveryPlannerPage.js';
import { AlertsPage } from './features/alerts/AlertsPage.js';
import { AnalyticsStudioPage } from './features/analytics/AnalyticsStudioPage.js';
import { AdminAuditPage } from './features/admin/AdminAuditPage.js';

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
              <Route path="twin-3d" element={<LogisticsDigitalTwin3D />} />
              <Route path="map" element={<LogisticsMapPage />} />
              <Route path="shipments" element={<ShipmentsPage />} />
              <Route path="documents" element={<DocumentIntelligencePage />} />
              <Route path="network" element={<DigitalTwinPage />} />
              <Route path="simulations" element={<DisruptionLabPage />} />
              <Route path="recovery" element={<RecoveryPlannerPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="analytics" element={<AnalyticsStudioPage />} />
              <Route path="admin" element={<AdminAuditPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};
