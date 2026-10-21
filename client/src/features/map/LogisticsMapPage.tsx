import React, { useState, useEffect, useMemo } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { api } from '../../lib/api.js';
import { useDigitalTwinStore } from '../digital-twin/DigitalTwinStore.js';
import { GoogleLogisticsMap } from './GoogleLogisticsMap.js';
import { KeylessLogisticsMap } from './KeylessLogisticsMap.js';
import { MapControlsOverlay } from './MapControlsOverlay.js';
import { EntityInspectorDrawer } from './EntityInspectorDrawer.js';
import { GoogleMapsSetupModal } from './GoogleMapsSetupModal.js';
import { RouteComputationResult } from './routeService.js';
import { CorridorRoute } from './RoutePolylineOverlay.js';
import {
  INITIAL_FACILITIES_3D,
  INITIAL_VEHICLES_3D,
  INITIAL_INCIDENTS_3D,
} from '../digital-twin/initialData.js';

// Authoritative Interstate Corridors
const DEFAULT_CORRIDORS: CorridorRoute[] = [
  {
    routeCode: 'ROUTE-I80-MW',
    name: 'Midwest-Northeast Prime (I-80 Corridor)',
    roadCorridor: 'I-80',
    distanceKm: 1280,
    durationHours: 14.5,
    routeType: 'planned',
    isClosed: true,
    coordinates: [
      [41.8781, -87.6298], // Chicago, IL
      [41.5868, -87.3464], // Gary, IN
      [41.6528, -83.5379], // Toledo, OH (Blizzard Incident)
      [41.4993, -81.6944], // Cleveland, OH
      [41.0998, -80.6495], // Youngstown, OH
      [41.137, -78.76],    // DuBois, PA
      [40.8653, -77.834],  // State College, PA
      [40.9128, -75.8752], // Hazleton, PA
      [40.8568, -74.1568], // Paterson, NJ
      [40.7128, -74.006],  // New York, NY
    ],
  },
  {
    routeCode: 'ROUTE-I70-BYPASS',
    name: 'South Interstate Bypass (I-70 / I-76 Resilience Detour)',
    roadCorridor: 'I-70',
    distanceKm: 1395,
    durationHours: 16.8,
    routeType: 'alternative',
    isBypassAlternative: true,
    coordinates: [
      [41.8781, -87.6298], // Chicago, IL
      [40.4173, -86.8753], // Lafayette, IN
      [39.7684, -86.1581], // Indianapolis, IN
      [39.9612, -82.9988], // Columbus, OH
      [40.0639, -80.7209], // Wheeling, WV
      [40.4406, -79.9959], // Pittsburgh, PA
      [40.0379, -76.3055], // Lancaster, PA
      [39.9526, -75.1652], // Philadelphia, PA
      [40.7128, -74.006],  // New York, NY
    ],
  },
  {
    routeCode: 'ROUTE-I10-PACIFIC',
    name: 'Southwest Transcontinental (I-10 / I-20 Corridor)',
    roadCorridor: 'I-10',
    distanceKm: 3450,
    durationHours: 34.0,
    routeType: 'planned',
    coordinates: [
      [33.7701, -118.1937], // Long Beach / LA
      [33.4484, -112.074],  // Phoenix, AZ
      [31.7619, -106.485],  // El Paso, TX
      [32.7767, -96.797],   // Dallas, TX
      [32.3547, -89.3985],  // Meridian, MS
      [33.749, -84.388],    // Atlanta, GA
    ],
  },
  {
    routeCode: 'ROUTE-I90-NORTH',
    name: 'Northern Cascades Arterial (I-90 Corridor)',
    roadCorridor: 'I-90',
    distanceKm: 3300,
    durationHours: 32.0,
    routeType: 'planned',
    coordinates: [
      [47.6062, -122.3321], // Seattle, WA
      [47.6588, -117.426],  // Spokane, WA
      [45.7833, -108.5007], // Billings, MT
      [43.546, -96.7311],   // Sioux Falls, SD
      [41.8781, -87.6298],  // Chicago, IL
    ],
  },
  {
    routeCode: 'ROUTE-I75-SOUTH',
    name: 'Great Lakes to Gulf Spine (I-75 Corridor)',
    roadCorridor: 'I-75',
    distanceKm: 1540,
    durationHours: 15.5,
    routeType: 'planned',
    coordinates: [
      [42.3314, -83.0458], // Detroit, MI
      [41.6528, -83.5379], // Toledo, OH
      [39.1031, -84.512],  // Cincinnati, OH
      [36.1627, -86.7816], // Nashville, TN
      [33.749, -84.388],   // Atlanta, GA
      [27.9506, -82.4572], // Tampa, FL
    ],
  },
];

export const LogisticsMapPage: React.FC = () => {
  // Global 3D Universe shared store
  const selectedEntity = useDigitalTwinStore(s => s.selectedEntity);
  const select3DEntity = useDigitalTwinStore(s => s.selectEntity);

  // API Key handling (Environment or localStorage)
  const [apiKey, setApiKey] = useState<string>(() => {
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
    return envKey || localStorage.getItem('flowtwin_google_maps_api_key') || '';
  });

  const mapId = (import.meta as any).env?.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Active provider: defaults to 'google' if key present, otherwise 'keyless' (zero key required!)
  const [activeProvider, setActiveProvider] = useState<'keyless' | 'google'>(() => {
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
    return (envKey || localStorage.getItem('flowtwin_google_maps_api_key'))
      ? 'google'
      : 'keyless';
  });

  // Domain data models
  const [facilities, setFacilities] = useState<any[]>(INITIAL_FACILITIES_3D);
  const [vehicles, setVehicles] = useState<any[]>(INITIAL_VEHICLES_3D);
  const [routes, setRoutes] = useState<CorridorRoute[]>(DEFAULT_CORRIDORS);
  const [disruptions, setDisruptions] = useState<any[]>(INITIAL_INCIDENTS_3D);
  const [shipments, setShipments] = useState<any[]>([]);

  // Filtering & Layer visibility
  const [showFacilities, setShowFacilities] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showDisruptions, setShowDisruptions] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'dark' | 'satellite' | 'roadmap' | 'terrain'>('dark');

  // Trigger states for map camera actions
  const [fitTrigger, setFitTrigger] = useState(0);
  const [focusDisruptionTrigger, setFocusDisruptionTrigger] = useState(0);

  // Calculated driving route from Routes API / Haversine vector service
  const [calculatedRoute, setCalculatedRoute] = useState<RouteComputationResult | null>(null);

  // Load operational backend data
  useEffect(() => {
    Promise.allSettled([
      api.get<any>('/facilities'),
      api.get<any>('/vehicles'),
      api.get<any>('/routes'),
      api.get<any>('/shipments?limit=50'),
    ]).then(([facRes, vehRes, routeRes, shipRes]) => {
      if (facRes.status === 'fulfilled' && facRes.value.facilities?.length > 0) {
        setFacilities(facRes.value.facilities);
      }
      if (vehRes.status === 'fulfilled' && vehRes.value.vehicles?.length > 0) {
        setVehicles(vehRes.value.vehicles);
      }
      if (routeRes.status === 'fulfilled' && routeRes.value.routes?.length > 0) {
        // Merge backend routes with default corridor geometries
        const mergedRoutes = DEFAULT_CORRIDORS.map(def => {
          const match = routeRes.value.routes.find((r: any) => r.routeCode === def.routeCode);
          return match ? { ...def, ...match } : def;
        });
        setRoutes(mergedRoutes);
      }
      if (shipRes.status === 'fulfilled' && shipRes.value.shipments?.length > 0) {
        setShipments(shipRes.value.shipments);
      }
    });
  }, []);

  // Save new key handler (persists to localStorage for immediate live feedback)
  const handleSaveKey = (newKey: string) => {
    const cleanKey = newKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('flowtwin_google_maps_api_key', cleanKey);
      setActiveProvider('google');
    } else {
      localStorage.removeItem('flowtwin_google_maps_api_key');
      setActiveProvider('keyless');
    }
  };

  // Filter entities according to search query
  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) return facilities;
    const q = searchQuery.toLowerCase();
    return facilities.filter(
      f =>
        f.name?.toLowerCase().includes(q) ||
        f.facilityCode?.toLowerCase().includes(q) ||
        f.location?.name?.toLowerCase().includes(q)
    );
  }, [facilities, searchQuery]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    const q = searchQuery.toLowerCase();
    return vehicles.filter(
      v =>
        v.vehicleCode?.toLowerCase().includes(q) ||
        v.carrierName?.toLowerCase().includes(q) ||
        v.currentLocation?.name?.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  // Selected shipment (if selected entity is a shipment)
  const selectedShipment = useMemo(() => {
    if (selectedEntity?.type === 'shipment') {
      return selectedEntity.data;
    }
    return null;
  }, [selectedEntity]);

  return (
    <div className="relative w-full h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-[#1E2642] bg-[#060814] shadow-2xl flex flex-col select-none">
      <div className="relative flex-1 w-full h-full">
        {/* Render Google Maps when key is available and selected, otherwise render Keyless Autonomous Map */}
        {activeProvider === 'google' && apiKey ? (
          <APIProvider apiKey={apiKey} libraries={['places', 'routes', 'geometry', 'marker']}>
            <GoogleLogisticsMap
              facilities={filteredFacilities}
              vehicles={filteredVehicles}
              routes={routes}
              disruptions={disruptions}
              selectedShipment={selectedShipment}
              selectedEntity={selectedEntity}
              showFacilities={showFacilities}
              showVehicles={showVehicles}
              showRoutes={showRoutes}
              showDisruptions={showDisruptions}
              showTraffic={showTraffic}
              mapType={mapType}
              mapId={mapId}
              activeRouteGeometry={calculatedRoute?.path}
              onSelectEntity={entity => select3DEntity(entity)}
              onSelectRoute={route =>
                select3DEntity({
                  type: 'route',
                  id: route.routeCode,
                  data: route,
                })
              }
              fitTrigger={fitTrigger}
              focusDisruptionTrigger={focusDisruptionTrigger}
            />
          </APIProvider>
        ) : (
          <KeylessLogisticsMap
            facilities={filteredFacilities}
            vehicles={filteredVehicles}
            routes={routes}
            disruptions={disruptions}
            selectedShipment={selectedShipment}
            selectedEntity={selectedEntity}
            showFacilities={showFacilities}
            showVehicles={showVehicles}
            showRoutes={showRoutes}
            showDisruptions={showDisruptions}
            showTraffic={showTraffic}
            mapType={mapType}
            activeRouteGeometry={calculatedRoute?.path}
            onSelectEntity={entity => select3DEntity(entity)}
            onSelectRoute={route =>
              select3DEntity({
                type: 'route',
                id: route.routeCode,
                data: route,
              })
            }
            fitTrigger={fitTrigger}
            focusDisruptionTrigger={focusDisruptionTrigger}
          />
        )}

        {/* Floating Top Controls and Filter Toolbar */}
        <MapControlsOverlay
          showFacilities={showFacilities}
          setShowFacilities={setShowFacilities}
          showVehicles={showVehicles}
          setShowVehicles={setShowVehicles}
          showRoutes={showRoutes}
          setShowRoutes={setShowRoutes}
          showDisruptions={showDisruptions}
          setShowDisruptions={setShowDisruptions}
          showTraffic={showTraffic}
          setShowTraffic={setShowTraffic}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          mapType={mapType}
          setMapType={setMapType}
          onFitAll={() => setFitTrigger(prev => prev + 1)}
          onFocusDisruption={() => setFocusDisruptionTrigger(prev => prev + 1)}
          onOpenSettings={() => setIsSetupModalOpen(true)}
          hasApiKey={Boolean(apiKey)}
          activeProvider={activeProvider}
          onToggleProvider={() => {
            setActiveProvider(prev => (prev === 'google' ? 'keyless' : 'google'));
          }}
        />

        {/* Synchronized Entity Inspector Drawer */}
        <EntityInspectorDrawer
          entity={selectedEntity}
          onClose={() => select3DEntity(null)}
          onSetCalculatedRoute={setCalculatedRoute}
          calculatedRoute={calculatedRoute}
        />
      </div>

      {/* Setup / Key Config Modal */}
      <GoogleMapsSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveKey}
      />
    </div>
  );
};
