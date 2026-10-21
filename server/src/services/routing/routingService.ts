export interface Coordinate {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteGeometry {
  routeCode: string;
  name: string;
  distanceKm: number;
  durationHours: number;
  routeType: 'planned' | 'observed' | 'simulated' | 'alternative';
  roadCorridor: string;
  isClosed?: boolean;
  coordinates: [number, number][]; // [lat, lng]
}

export class RoutingService {
  /**
   * High-fidelity corridor coordinates for primary logistics arteries
   */
  public static getCorridorRoutes(): RouteGeometry[] {
    return [
      {
        routeCode: 'RT-CHI-NYC-I80',
        name: 'Midwest-Northeast Prime (I-80 Corridor)',
        distanceKm: 1280,
        durationHours: 14.5,
        routeType: 'planned',
        roadCorridor: 'I-80',
        isClosed: false,
        coordinates: [
          [41.8781, -87.6298], // Chicago, IL
          [41.5868, -87.3464], // Gary, IN
          [41.6528, -83.5379], // Toledo, OH
          [41.4993, -81.6944], // Cleveland, OH
          [41.0998, -80.6495], // Youngstown, OH
          [41.1370, -78.7600], // DuBois, PA
          [40.8653, -77.8340], // State College / Bellefonte
          [40.9128, -75.8752], // Hazleton, PA
          [40.8568, -74.1568], // Paterson, NJ
          [40.7128, -74.0060], // New York, NY
        ],
      },
      {
        routeCode: 'RT-CHI-NYC-DETOUR',
        name: 'South Interstate Bypass (I-70 / I-76 Detour)',
        distanceKm: 1395,
        durationHours: 16.8,
        routeType: 'alternative',
        roadCorridor: 'I-70',
        coordinates: [
          [41.8781, -87.6298], // Chicago, IL
          [40.4173, -86.8753], // Lafayette, IN
          [39.7684, -86.1581], // Indianapolis, IN
          [39.9612, -82.9988], // Columbus, OH
          [40.0639, -80.7209], // Wheeling, WV
          [40.4406, -79.9959], // Pittsburgh, PA
          [40.0379, -76.3055], // Lancaster, PA
          [39.9526, -75.1652], // Philadelphia, PA
          [40.7128, -74.0060], // New York, NY
        ],
      },
      {
        routeCode: 'RT-LAX-DAL-I10',
        name: 'Southwest Transcontinental (I-10 / I-20)',
        distanceKm: 2310,
        durationHours: 23.5,
        routeType: 'planned',
        roadCorridor: 'I-10',
        coordinates: [
          [34.0522, -118.2437], // Los Angeles, CA
          [34.1083, -117.2898], // San Bernardino, CA
          [33.4484, -112.0740], // Phoenix, AZ
          [32.2226, -110.9747], // Tucson, AZ
          [31.7619, -106.4850], // El Paso, TX
          [31.8457, -102.3676], // Odessa, TX
          [32.4487, -99.7331],  // Abilene, TX
          [32.7767, -96.7970],  // Dallas, TX
        ],
      },
      {
        routeCode: 'RT-SEA-CHI-I90',
        name: 'Pacific Northwest Link (I-90 Corridor)',
        distanceKm: 3320,
        durationHours: 32.0,
        routeType: 'planned',
        roadCorridor: 'I-90',
        coordinates: [
          [47.6062, -122.3321], // Seattle, WA
          [47.6588, -117.4260], // Spokane, WA
          [46.8721, -113.9940], // Missoula, MT
          [45.7833, -108.5007], // Billings, MT
          [44.0805, -103.2310], // Rapid City, SD
          [43.5460, -96.7313],  // Sioux Falls, SD
          [43.9016, -91.8000],  // Rochester, MN
          [43.0731, -89.4012],  // Madison, WI
          [41.8781, -87.6298],  // Chicago, IL
        ],
      },
      {
        routeCode: 'RT-ATL-MIA-I95',
        name: 'Southeast Freight Spine (I-75 / Florida Turnpike)',
        distanceKm: 1070,
        durationHours: 10.5,
        routeType: 'planned',
        roadCorridor: 'I-75',
        coordinates: [
          [33.7490, -84.3880], // Atlanta, GA
          [32.8407, -83.6324], // Macon, GA
          [30.8327, -83.2785], // Valdosta, GA
          [29.6516, -82.3248], // Gainesville, FL
          [28.5383, -81.3792], // Orlando, FL
          [26.7153, -80.0534], // West Palm Beach, FL
          [25.7617, -80.1918], // Miami, FL
        ],
      },
    ];
  }

  /**
   * Interpolate synthetic position along a route path based on elapsed progress (0 to 1)
   */
  public static interpolatePosition(
    coordinates: [number, number][],
    progress: number
  ): [number, number] {
    if (!coordinates || coordinates.length === 0) return [41.8781, -87.6298];
    const clamped = Math.max(0, Math.min(1, progress));
    const totalSegments = coordinates.length - 1;
    const segmentIndex = Math.min(Math.floor(clamped * totalSegments), totalSegments - 1);
    const segmentFraction = (clamped * totalSegments) - segmentIndex;

    const p1 = coordinates[segmentIndex];
    const p2 = coordinates[segmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentFraction;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentFraction;

    return [Math.round(lat * 10000) / 10000, Math.round(lng * 10000) / 10000];
  }
}
