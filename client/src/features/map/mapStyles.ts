// FlowTwin AI Dark Command-Center Google Maps Style
// Custom styled to harmonize with FlowTwin's obsidian and cyan palette

export const DARK_COMMAND_CENTER_STYLE: google.maps.MapTypeStyle[] = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#0B0E1E' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#060814' }, { weight: 3 }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8F9CAE' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1E2640' }, { weight: 1.5 }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#161D33' }, { weight: 1.0 }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00F5FF' }, { weight: 0.5 }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#0E1428' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#151C34' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0E1324' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2A365D' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#151C34' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#A855F7' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#121A30' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#10B981' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#04060E' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3B82F6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#04060E' }],
  },
];
