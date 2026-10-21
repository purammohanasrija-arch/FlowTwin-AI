import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export interface CorridorRoute {
  routeCode: string;
  name: string;
  roadCorridor: string;
  distanceKm: number;
  durationHours?: number;
  routeType: 'planned' | 'observed' | 'alternative';
  isClosed?: boolean;
  isBypassAlternative?: boolean;
  coordinates: [number, number][]; // [lat, lng]
}

interface RoutePolylineOverlayProps {
  routes: CorridorRoute[];
  activeRouteGeometry?: google.maps.LatLngLiteral[] | null;
  showRoutes: boolean;
  onSelectRoute: (route: CorridorRoute) => void;
}

export const RoutePolylineOverlay: React.FC<RoutePolylineOverlayProps> = ({
  routes,
  activeRouteGeometry,
  showRoutes,
  onSelectRoute,
}) => {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const activeRoutePolylineRef = useRef<google.maps.Polyline | null>(null);

  // Render static & network corridor routes
  useEffect(() => {
    if (!map) return;

    // Clear previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    if (!showRoutes) return;

    routes.forEach(route => {
      const isDetour = route.isBypassAlternative || route.routeType === 'alternative';
      const isClosed = route.isClosed || route.roadCorridor === 'I-80';

      const strokeColor = isClosed ? '#EF4444' : isDetour ? '#10B981' : '#8B5CF6';

      const path = route.coordinates.map(([lat, lng]) => ({ lat, lng }));

      // Create main polyline
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor,
        strokeOpacity: isDetour ? 0.95 : 0.85,
        strokeWeight: isDetour ? 4 : 3.5,
        map,
        zIndex: isDetour ? 15 : isClosed ? 12 : 10,
        // For dashed effect on alternative detour:
        icons: isDetour
          ? [
              {
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 3,
                  strokeColor: '#10B981',
                },
                offset: '0',
                repeat: '15px',
              },
            ]
          : undefined,
      });

      // Hover glow effect
      polyline.addListener('mouseover', () => {
        polyline.setOptions({
          strokeWeight: 6,
          strokeColor: '#00F5FF',
        });
      });

      polyline.addListener('mouseout', () => {
        polyline.setOptions({
          strokeWeight: isDetour ? 4 : 3.5,
          strokeColor,
        });
      });

      // Click handler
      polyline.addListener('click', () => {
        onSelectRoute(route);
      });

      polylinesRef.current.push(polyline);
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routes, showRoutes, onSelectRoute]);

  // Render dynamic active route (e.g. from Google Routes API when inspecting a specific shipment)
  useEffect(() => {
    if (!map) return;

    if (activeRoutePolylineRef.current) {
      activeRoutePolylineRef.current.setMap(null);
      activeRoutePolylineRef.current = null;
    }

    if (!activeRouteGeometry || activeRouteGeometry.length === 0) return;

    const activePolyline = new google.maps.Polyline({
      path: activeRouteGeometry,
      geodesic: true,
      strokeColor: '#00F5FF',
      strokeOpacity: 0.95,
      strokeWeight: 5,
      map,
      zIndex: 25,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            strokeColor: '#00F5FF',
            fillColor: '#FFFFFF',
            fillOpacity: 1,
          },
          offset: '50%',
          repeat: '120px',
        },
      ],
    });

    activeRoutePolylineRef.current = activePolyline;

    return () => {
      if (activeRoutePolylineRef.current) {
        activeRoutePolylineRef.current.setMap(null);
        activeRoutePolylineRef.current = null;
      }
    };
  }, [map, activeRouteGeometry]);

  return null;
};
