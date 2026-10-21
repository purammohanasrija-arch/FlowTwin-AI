import React, { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface TrafficLayerOverlayProps {
  enabled: boolean;
}

export const TrafficLayerOverlay: React.FC<TrafficLayerOverlayProps> = ({ enabled }) => {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (enabled) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, enabled]);

  return null;
};
