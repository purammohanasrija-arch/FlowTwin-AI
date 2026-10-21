import React, { useEffect, useCallback } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { DARK_COMMAND_CENTER_STYLE } from './mapStyles.js';
import { LogisticsMarkers } from './LogisticsMarkers.js';
import { RoutePolylineOverlay, CorridorRoute } from './RoutePolylineOverlay.js';
import { TrafficLayerOverlay } from './TrafficLayerOverlay.js';
import { RouteComputationResult } from './routeService.js';
import { SelectedEntity } from '../digital-twin/types.js';

interface GoogleLogisticsMapProps {
  facilities: any[];
  vehicles: any[];
  routes: CorridorRoute[];
  disruptions: any[];
  selectedShipment?: any | null;
  selectedEntity: any | null;
  showFacilities: boolean;
  showVehicles: boolean;
  showRoutes: boolean;
  showDisruptions: boolean;
  showTraffic: boolean;
  mapType: 'dark' | 'satellite' | 'roadmap' | 'terrain';
  mapId: string;
  activeRouteGeometry?: google.maps.LatLngLiteral[] | null;
  onSelectEntity: (entity: SelectedEntity) => void;
  onSelectRoute: (route: CorridorRoute) => void;
  fitTrigger: number;
  focusDisruptionTrigger: number;
}

export const GoogleLogisticsMap: React.FC<GoogleLogisticsMapProps> = ({
  facilities,
  vehicles,
  routes,
  disruptions,
  selectedShipment,
  selectedEntity,
  showFacilities,
  showVehicles,
  showRoutes,
  showDisruptions,
  showTraffic,
  mapType,
  mapId,
  activeRouteGeometry,
  onSelectEntity,
  onSelectRoute,
  fitTrigger,
  focusDisruptionTrigger,
}) => {
  return (
    <div className="relative w-full h-full">
      <Map
        mapId={mapId || 'DEMO_MAP_ID'}
        defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
        defaultZoom={4.2}
        minZoom={3}
        maxZoom={18}
        styles={mapType === 'dark' ? DARK_COMMAND_CENTER_STYLE : undefined}
        mapTypeId={
          mapType === 'satellite'
            ? 'hybrid'
            : mapType === 'terrain'
            ? 'terrain'
            : 'roadmap'
        }
        internalUsageAttributionIds={['gmp_git_agentskills_v1']}
        gestureHandling="greedy"
        zoomControl
        fullscreenControl
        streetViewControl={false}
        mapTypeControl={false}
        className="w-full h-full"
      >
        {/* Helper Controller for Imperative Actions (Bounds, Pan, Zoom) */}
        <MapImperativeController
          facilities={facilities}
          disruptions={disruptions}
          selectedEntity={selectedEntity}
          fitTrigger={fitTrigger}
          focusDisruptionTrigger={focusDisruptionTrigger}
        />

        {/* 1. Custom Logistics Markers */}
        <LogisticsMarkers
          facilities={facilities}
          vehicles={vehicles}
          disruptions={disruptions}
          selectedShipment={selectedShipment}
          selectedEntity={selectedEntity}
          showFacilities={showFacilities}
          showVehicles={showVehicles}
          showDisruptions={showDisruptions}
          onSelectEntity={onSelectEntity}
        />

        {/* 2. Route Corridor & Active Polyline Overlay */}
        <RoutePolylineOverlay
          routes={routes}
          activeRouteGeometry={activeRouteGeometry}
          showRoutes={showRoutes}
          onSelectRoute={onSelectRoute}
        />

        {/* 3. Real-Time Google Maps Traffic Density Layer */}
        <TrafficLayerOverlay enabled={showTraffic} />
      </Map>
    </div>
  );
};

// Imperative controller inside Map context
interface MapImperativeControllerProps {
  facilities: any[];
  disruptions: any[];
  selectedEntity: any | null;
  fitTrigger: number;
  focusDisruptionTrigger: number;
}

const MapImperativeController: React.FC<MapImperativeControllerProps> = ({
  facilities,
  disruptions,
  selectedEntity,
  fitTrigger,
  focusDisruptionTrigger,
}) => {
  const map = useMap();

  // Handle fit all network trigger
  useEffect(() => {
    if (!map || facilities.length === 0 || fitTrigger === 0) return;

    const bounds = new google.maps.LatLngBounds();
    facilities.forEach(fac => {
      if (fac.location?.lat && fac.location?.lng) {
        bounds.extend({ lat: fac.location.lat, lng: fac.location.lng });
      }
    });

    map.fitBounds(bounds, { top: 70, right: 360, bottom: 60, left: 60 });
  }, [map, facilities, fitTrigger]);

  // Handle focus disruption trigger
  useEffect(() => {
    if (!map || focusDisruptionTrigger === 0) return;

    // Focus on I-80 Midwest Blizzard epicenter
    const epicenter = disruptions[0]?.location || { lat: 41.6528, lng: -83.5379 };
    const lat = epicenter.latitude || epicenter.lat || 41.6528;
    const lng = epicenter.longitude || epicenter.lng || -83.5379;

    map.panTo({ lat, lng });
    map.setZoom(8);
  }, [map, disruptions, focusDisruptionTrigger]);

  // Pan to selected entity
  useEffect(() => {
    if (!map || !selectedEntity) return;

    let targetLat: number | undefined;
    let targetLng: number | undefined;

    if (selectedEntity.type === 'facility' && selectedEntity.data?.location) {
      targetLat = selectedEntity.data.location.lat;
      targetLng = selectedEntity.data.location.lng;
    } else if (selectedEntity.type === 'vehicle' && selectedEntity.data?.currentLocation) {
      targetLat = selectedEntity.data.currentLocation.lat;
      targetLng = selectedEntity.data.currentLocation.lng;
    } else if (selectedEntity.type === 'disruption') {
      const loc = selectedEntity.data?.location;
      targetLat = loc?.latitude || loc?.lat || 41.6528;
      targetLng = loc?.longitude || loc?.lng || -83.5379;
    }

    if (typeof targetLat === 'number' && typeof targetLng === 'number') {
      map.panTo({ lat: targetLat, lng: targetLng });
      if (map.getZoom() && (map.getZoom() as number) < 7) {
        map.setZoom(7);
      }
    }
  }, [map, selectedEntity]);

  return null;
};
