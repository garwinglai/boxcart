export const fetchAllProductsNearby = async (
  userLat,
  userLng,
  distance,
  lastProductIdFromNearbyFetch
) => {
  const url = `https://boxcart.shop/api/public/extension/get-products-nearby?userLat=${userLat}&userLng=${userLng}&distance=${distance}&lastProductId=${lastProductIdFromNearbyFetch}`;
  const localUrl = `http://localhost:3000/api/public/extension/get-products-nearby?userLat=${userLat}&userLng=${userLng}&distance=${distance}&lastProductId=${lastProductIdFromNearbyFetch}`;
  const response = await fetch(localUrl, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  return null;
};

export const fetchSearchedProducts = async (
  userQuery,
  userLat,
  userLng,
  distance,
  lastProductIdFromSearch
) => {
  const apiUrl = `https://boxcart.shop/api/public/extension/product/${userQuery}?userLat=${userLat}&userLng=${userLng}&distance=${distance}&lastProductId=${lastProductIdFromSearch}`;

  const localUrl = `http://localhost:3000/api/public/extension/product/${userQuery}?userLat=${userLat}&userLng=${userLng}&distance=${distance}&lastProductId=${lastProductIdFromSearch}`;

  const response = await fetch(localUrl, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  return null;
};
