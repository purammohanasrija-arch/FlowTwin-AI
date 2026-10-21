import * as THREE from 'three';

const CENTER_LNG = -98.5795;
const CENTER_LAT = 39.8283;
const SCALE_X = 1.7;
const SCALE_Z = 2.4;

/**
 * Converts geographic [lat, lng] into 3D scene coordinates [x, y, z].
 * Safely guards against undefined or NaN coordinates.
 */
export function geoTo3D(lat?: number, lng?: number, elevation: number = 0): [number, number, number] {
  const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat : CENTER_LAT;
  const safeLng = typeof lng === 'number' && !isNaN(lng) ? lng : CENTER_LNG;
  const x = (safeLng - CENTER_LNG) * SCALE_X;
  const z = -(safeLat - CENTER_LAT) * SCALE_Z;
  return [x, elevation, z];
}

export function geoToVector3(lat?: number, lng?: number, elevation: number = 0): THREE.Vector3 {
  const [x, y, z] = geoTo3D(lat, lng, elevation);
  return new THREE.Vector3(x, y, z);
}

/**
 * Creates a CatmullRomCurve3 from an array of [lat, lng] coordinates.
 */
export function createRouteCurve(coordinates?: [number, number][], baseElevation: number = 0.3): THREE.CatmullRomCurve3 {
  if (!coordinates || coordinates.length < 2) {
    // Fallback line between Chicago and New York
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(17, baseElevation, -4),
      new THREE.Vector3(39, baseElevation, -2),
    ]);
  }

  const points = coordinates.map((coord, index) => {
    const lat = Array.isArray(coord) ? coord[0] : (coord as any).lat;
    const lng = Array.isArray(coord) ? coord[1] : (coord as any).lng;
    const progress = index / Math.max(coordinates.length - 1, 1);
    const archElevation = Math.sin(progress * Math.PI) * 1.2;
    const [x, , z] = geoTo3D(lat, lng);
    return new THREE.Vector3(x, baseElevation + archElevation, z);
  });

  return new THREE.CatmullRomCurve3(points);
}
