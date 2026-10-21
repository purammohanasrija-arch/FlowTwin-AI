import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CorridorRoute } from './RoutePolylineOverlay.js';
import { SelectedEntity } from '../digital-twin/types.js';

export interface KeylessLogisticsMapProps {
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
  activeRouteGeometry?: { lat: number; lng: number }[] | null;
  onSelectEntity: (entity: SelectedEntity) => void;
  onSelectRoute: (route: CorridorRoute) => void;
  fitTrigger: number;
  focusDisruptionTrigger: number;
}

export const KeylessLogisticsMap: React.FC<KeylessLogisticsMapProps> = ({
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
  activeRouteGeometry,
  onSelectEntity,
  onSelectRoute,
  fitTrigger,
  focusDisruptionTrigger,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const overlayLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Leaflet Map on Mount
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795], // US Geographic Centroid
      zoom: 4,
      minZoom: 3,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: true,
    });

    // Add zoom controls at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer groups for dynamic tiles and interactive overlays
    const tileGroup = L.layerGroup().addTo(map);
    const overlayGroup = L.layerGroup().addTo(map);

    tileLayerGroupRef.current = tileGroup;
    overlayLayerGroupRef.current = overlayGroup;
    mapInstanceRef.current = map;

    // Invalidate size once DOM stabilizes
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Manage Tile Layers Dynamically (Zero API Key Required, Zero Watermarks)
  useEffect(() => {
    const tileGroup = tileLayerGroupRef.current;
    if (!tileGroup) return;

    tileGroup.clearLayers();

    if (mapType === 'dark') {
      // 100% Free, High-Res ESRI ArcGIS World Dark Gray Canvas (Zero Watermarks)
      const baseDark = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        }
      );
      // Crisp highway and city label reference overlay
      const labelsDark = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '',
          maxZoom: 16,
          opacity: 0.9,
        }
      );
      tileGroup.addLayer(baseDark);
      tileGroup.addLayer(labelsDark);
    } else if (mapType === 'satellite') {
      // High-resolution real photographic satellite view (ESRI World Imagery)
      const satellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 18,
        }
      );
      // Official crisp satellite reference layer (highways, borders, state lines, cities)
      const bordersAndPlaces = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '',
          maxZoom: 18,
          opacity: 0.9,
        }
      );
      tileGroup.addLayer(satellite);
      tileGroup.addLayer(bordersAndPlaces);
    } else if (mapType === 'terrain') {
      // High-resolution topographic elevation & terrain
      const topo = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, HERE, Garmin, Intermap',
          maxZoom: 18,
        }
      );
      tileGroup.addLayer(topo);
    } else {
      // OpenStreetMap Standard Roadmap
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      });
      tileGroup.addLayer(osm);
    }
  }, [mapType]);

  // 3. Render Overlays (Routes, Corridors, Facilities, Vehicles, Disruptions, Active Routes)
  useEffect(() => {
    const overlayGroup = overlayLayerGroupRef.current;
    if (!overlayGroup) return;

    overlayGroup.clearLayers();

    // ----------------------------------------------------
    // A. INTERSTATE CORRIDORS & ROUTES
    // ----------------------------------------------------
    if (showRoutes) {
      routes.forEach(route => {
        const isClosed = route.isClosed;
        const isBypass = route.isBypassAlternative;
        const isSelected =
          selectedEntity?.type === 'route' && selectedEntity.id === route.routeCode;

        let strokeColor = '#3B82F6'; // Default primary blue
        let dashPattern = undefined;
        let weight = isSelected ? 6 : 4;
        let opacity = isSelected ? 1 : 0.8;

        if (isClosed) {
          strokeColor = '#EF4444'; // Red closed corridor (I-80 Blizzard)
        } else if (isBypass) {
          strokeColor = '#06B6D4'; // Cyan alternative bypass (I-70 / I-76)
          dashPattern = '8, 8';
        }

        const latLngs: L.LatLngExpression[] = route.coordinates.map(pt => [pt[0], pt[1]]);
        const polyline = L.polyline(latLngs, {
          color: strokeColor,
          weight,
          opacity,
          dashArray: dashPattern,
        });

        polyline.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px;">
            <strong style="color: ${strokeColor};">${route.roadCorridor}: ${route.name}</strong><br/>
            <span>Distance: ${route.distanceKm} km | Est. Time: ${route.durationHours}h</span>
            ${isClosed ? '<br/><span style="color: #F87171; font-weight: bold;">CLOSED: Active Blizzard</span>' : ''}
            ${isBypass ? '<br/><span style="color: #22D3EE; font-weight: bold;">ALTERNATIVE DETOUR BUNDLE</span>' : ''}
          </div>`,
          { sticky: true, className: 'flowtwin-leaflet-tooltip' }
        );

        polyline.on('click', () => onSelectRoute(route));
        overlayGroup.addLayer(polyline);
      });
    }

    // ----------------------------------------------------
    // B. SIMULATED LIVE TRAFFIC CONGESTION OVERLAYS
    // ----------------------------------------------------
    if (showTraffic) {
      const trafficBottlenecks: { coords: [number, number][]; color: string; label: string }[] = [
        // Chicago Metro (I-90 / I-94 Kennedy Expressway)
        {
          coords: [
            [41.9742, -87.8906],
            [41.9214, -87.7214],
            [41.8781, -87.6298],
            [41.7924, -87.5901],
          ],
          color: '#DC2626',
          label: 'Chicago I-90/94: Heavy Congestion (Avg Speed: 14 mph)',
        },
        // Toledo Disruption Staging Area
        {
          coords: [
            [41.6528, -83.5379],
            [41.5901, -83.2104],
            [41.4993, -81.6944],
          ],
          color: '#EF4444',
          label: 'I-80 Mile 390-420: Severe Gridlock / Blizzard Freeze',
        },
        // New York Lincoln / Holland Tunnel Arterials
        {
          coords: [
            [40.8568, -74.1568],
            [40.7614, -74.0324],
            [40.7128, -74.006],
          ],
          color: '#F59E0B',
          label: 'NYC Cross-Harbor Access: Moderate Queue (+35 min)',
        },
        // Atlanta I-75/I-85 Downtown Connector
        {
          coords: [
            [33.8504, -84.3644],
            [33.749, -84.388],
            [33.6407, -84.4277],
          ],
          color: '#F97316',
          label: 'Atlanta I-85 Spine: Heavy Commuter Freight Flow',
        },
      ];

      trafficBottlenecks.forEach(tb => {
        const line = L.polyline(tb.coords, {
          color: tb.color,
          weight: 7,
          opacity: 0.85,
        });
        line.bindTooltip(
          `<span style="font-size: 11px; font-weight: bold; color: ${tb.color};">${tb.label}</span>`,
          { sticky: true }
        );
        overlayGroup.addLayer(line);
      });
    }

    // ----------------------------------------------------
    // C. ACTIVE DISRUPTION HAZARD (Toledo I-80 Blizzard)
    // ----------------------------------------------------
    if (showDisruptions) {
      disruptions.forEach((dis, idx) => {
        const lat = dis.location?.latitude || dis.location?.lat || 41.6528;
        const lng = dis.location?.longitude || dis.location?.lng || -83.5379;
        const isSelected =
          selectedEntity?.type === 'incident' || selectedEntity?.type === 'disruption';

        // Custom pulsing hazard HTML marker
        const hazardHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${
            isSelected ? 'scale(1.2)' : 'scale(1)'
          };">
            <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></span>
            <div style="display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 12px; background: rgba(69, 10, 10, 0.95); border: 2px solid #EF4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.6); color: #FEE2E2; font-family: monospace; font-weight: bold; backdrop-filter: blur(8px);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div style="display: flex; flex-direction: column; line-height: 1.1;">
                <span style="font-size: 10px; text-transform: uppercase; color: #FCA5A5; letter-spacing: 0.05em;">I-80 Blizzard</span>
                <span style="font-size: 8px; color: #9CA3AF;">CRITICAL HOLD</span>
              </div>
            </div>
            <div style="width: 2px; height: 10px; background: #EF4444;"></div>
            <div style="width: 8px; height: 8px; border-radius: 9999px; background: #EF4444; box-shadow: 0 0 8px #EF4444;"></div>
          </div>
        `;

        const hazardIcon = L.divIcon({
          html: hazardHtml,
          className: 'flowtwin-hazard-icon',
          iconSize: [120, 60],
          iconAnchor: [60, 50],
        });

        const marker = L.marker([lat, lng], { icon: hazardIcon });
        marker.on('click', () => {
          onSelectEntity({
            type: 'incident',
            id: dis.incidentCode || 'INC-BLIZZ-01',
            data: dis,
          });
        });

        overlayGroup.addLayer(marker);
      });
    }

    // ----------------------------------------------------
    // D. LOGISTICS FACILITIES (Ports, Hubs, Plants, Yards)
    // ----------------------------------------------------
    if (showFacilities) {
      facilities.forEach(fac => {
        const lat = fac.location?.lat;
        const lng = fac.location?.lng;
        if (typeof lat !== 'number' || typeof lng !== 'number') return;

        const isSelected =
          selectedEntity?.type === 'facility' && selectedEntity.id === fac.facilityCode;
        const util = fac.utilizationPercentage || 65;
        const isCongested = util >= 80;
        const statusCol = isCongested ? '#F59E0B' : '#10B981';

        let categoryShort = 'HUB';
        let iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;

        if (fac.facilityCategory === 'coastal_port' || fac.type === 'port') {
          categoryShort = 'PORT';
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;
        } else if (fac.facilityCategory === 'airport_hub') {
          categoryShort = 'AIR';
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
        } else if (fac.facilityCategory === 'rail_intermodal') {
          categoryShort = 'RAIL';
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>`;
        }

        const facilityHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; ${
            isSelected ? 'transform: scale(1.15); z-index: 50;' : 'z-index: 20;'
          }">
            <div style="display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 12px; background: rgba(11, 14, 34, 0.95); border: 2px solid ${
              isSelected ? '#00F5FF' : statusCol
            }; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6); color: #FFFFFF; font-family: sans-serif; backdrop-filter: blur(8px);">
              <div style="color: ${isSelected ? '#00F5FF' : statusCol}; display: flex; align-items: center;">
                ${iconSvg}
              </div>
              <div style="display: flex; flex-direction: column; line-height: 1;">
                <span style="font-size: 10px; font-weight: bold; white-space: nowrap; max-width: 100px; overflow: hidden; text-overflow: ellipsis;">${
                  fac.name.split(' ')[0]
                }</span>
                <span style="font-size: 8px; color: ${statusCol}; font-family: monospace; font-weight: bold;">${categoryShort} • ${util}%</span>
              </div>
            </div>
            <div style="width: 2px; height: 6px; background: ${statusCol};"></div>
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: ${statusCol}; box-shadow: 0 0 6px ${statusCol};"></div>
          </div>
        `;

        const facIcon = L.divIcon({
          html: facilityHtml,
          className: 'flowtwin-facility-icon',
          iconSize: [120, 40],
          iconAnchor: [60, 36],
        });

        const marker = L.marker([lat, lng], { icon: facIcon });
        marker.on('click', () => {
          onSelectEntity({
            type: 'facility',
            id: fac.facilityCode,
            data: fac,
          });
        });

        overlayGroup.addLayer(marker);
      });
    }

    // ----------------------------------------------------
    // E. ACTIVE FLEET VEHICLES (Trucks & Transporters)
    // ----------------------------------------------------
    if (showVehicles) {
      vehicles.forEach(veh => {
        const lat = veh.currentLocation?.lat;
        const lng = veh.currentLocation?.lng;
        if (typeof lat !== 'number' || typeof lng !== 'number') return;

        const isSelected =
          selectedEntity?.type === 'vehicle' && selectedEntity.id === veh.vehicleCode;
        const isDelayed = veh.status === 'delayed' || veh.isDelayedByDisruption;
        const vehColor = isDelayed ? '#F59E0B' : '#10B981';

        const vehicleHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; ${
            isSelected ? 'transform: scale(1.2); z-index: 55;' : 'z-index: 30;'
          }">
            <div style="display: flex; align-items: center; gap: 5px; padding: 3px 7px; border-radius: 10px; background: rgba(9, 10, 16, 0.95); border: 1.5px solid ${
              isSelected ? '#00F5FF' : vehColor
            }; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); color: #FFFFFF; font-family: monospace;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${vehColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                <path d="M15 18H9"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                <circle cx="17" cy="18" r="2"/>
                <circle cx="7" cy="18" r="2"/>
              </svg>
              <div style="display: flex; flex-direction: column; line-height: 1;">
                <span style="font-size: 9px; font-weight: bold; color: ${
                  isSelected ? '#00F5FF' : '#E5E7EB'
                };">${veh.vehicleCode}</span>
                <span style="font-size: 7px; color: ${vehColor};">${veh.currentSpeedKmh || 65} km/h</span>
              </div>
            </div>
            <div style="width: 2px; height: 5px; background: ${vehColor};"></div>
            <div style="width: 5px; height: 5px; border-radius: 9999px; background: ${vehColor}; box-shadow: 0 0 5px ${vehColor};"></div>
          </div>
        `;

        const truckIcon = L.divIcon({
          html: vehicleHtml,
          className: 'flowtwin-vehicle-icon',
          iconSize: [80, 35],
          iconAnchor: [40, 30],
        });

        const marker = L.marker([lat, lng], { icon: truckIcon });
        marker.on('click', () => {
          onSelectEntity({
            type: 'vehicle',
            id: veh.vehicleCode,
            data: veh,
          });
        });

        overlayGroup.addLayer(marker);
      });
    }

    // ----------------------------------------------------
    // F. ACTIVE CALCULATED ROUTE & SHIPMENT PINS
    // ----------------------------------------------------
    if (activeRouteGeometry && activeRouteGeometry.length > 0) {
      const routePoints: L.LatLngExpression[] = activeRouteGeometry.map(p => [p.lat, p.lng]);

      // Glowing route polyline
      const activeLine = L.polyline(routePoints, {
        color: '#00F5FF',
        weight: 5,
        opacity: 0.9,
        dashArray: '6, 6',
      });
      overlayGroup.addLayer(activeLine);

      // Origin Pin (Green)
      const originPt = activeRouteGeometry[0];
      const originHtml = `
        <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 9999px; background: #10B981; border: 2px solid #FFFFFF; box-shadow: 0 0 10px #10B981; color: white; font-weight: bold; font-size: 11px;">
          A
        </div>
      `;
      const originIcon = L.divIcon({
        html: originHtml,
        className: 'origin-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      overlayGroup.addLayer(L.marker([originPt.lat, originPt.lng], { icon: originIcon }));

      // Destination Pin (Purple)
      const destPt = activeRouteGeometry[activeRouteGeometry.length - 1];
      const destHtml = `
        <div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 9999px; background: #8B5CF6; border: 2px solid #FFFFFF; box-shadow: 0 0 10px #8B5CF6; color: white; font-weight: bold; font-size: 11px;">
          B
        </div>
      `;
      const destIcon = L.divIcon({
        html: destHtml,
        className: 'dest-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      overlayGroup.addLayer(L.marker([destPt.lat, destPt.lng], { icon: destIcon }));
    }
  }, [
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
    activeRouteGeometry,
    onSelectEntity,
    onSelectRoute,
  ]);

  // 4. Handle "Fit All Network" Camera Trigger
  useEffect(() => {
    if (fitTrigger === 0 || !mapInstanceRef.current) return;

    const coords: [number, number][] = [];
    facilities.forEach(fac => {
      if (fac.location?.lat && fac.location?.lng) {
        coords.push([fac.location.lat, fac.location.lng]);
      }
    });

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 6 });
    }
  }, [fitTrigger, facilities]);

  // 5. Handle "Focus Disruption Hazard" Camera Trigger
  useEffect(() => {
    if (focusDisruptionTrigger === 0 || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([41.6528, -83.5379], 8, { duration: 1.2 });
  }, [focusDisruptionTrigger]);

  return (
    <div className="relative w-full h-full bg-[#070A18]">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
