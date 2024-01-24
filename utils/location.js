export function calculateBoundingBox(latitude, longitude, distanceInMiles) {
  const earthRadius = 3959; // Earth radius in miles

  // Convert distance to radians
  const distanceInRadians = distanceInMiles / earthRadius;

  // Convert latitude and longitude to radians
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;

  // Calculate the delta latitude and delta longitude
  const deltaLat = distanceInRadians;
  const deltaLon = Math.asin(Math.sin(distanceInRadians) / Math.cos(latRad));

  // Calculate the southwest and northeast corners
  const swLat = latitude - (deltaLat * 180) / Math.PI;
  const swLon = longitude - (deltaLon * 180) / Math.PI;

  const neLat = latitude + (deltaLat * 180) / Math.PI;
  const neLon = longitude + (deltaLon * 180) / Math.PI;

  return {
    southwest: { lat: swLat, lng: swLon },
    northeast: { lat: neLat, lng: neLon },
  };
}

export function calculateDistanceInKilometers(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}

function calculateDistanceInMiles(lat1, lon1, lat2, lon2) {
  const earthRadius = 3959; // Earth radius in miles

  // Convert latitude and longitude to radians
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  // Calculate differences
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance
  const distance = earthRadius * c;

  return distance;
}
