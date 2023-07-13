export async function createProductClient(product) {
  const productApiRoute = `/api/private/inventory/product/create`;

  const resCreateProduct = await fetch(productApiRoute, {
    method: "POST",
    body: JSON.stringify({ product }),
  });
  const resCreateProductJson = await resCreateProduct.json();

  if (resCreateProduct.status === 200) {
    return { success: true, value: resCreateProductJson };
  } else {
    return { success: false, value: null };
  }
}

export async function updateProductClient(product) {
  const productApiRoute = `/api/private/inventory/product/update`;

  const resUpdateProduct = await fetch(productApiRoute, {
    method: "POST",
    body: JSON.stringify(product),
  });

  const resUpdateProductJson = await resUpdateProduct.json();

  if (resUpdateProduct.status === 200) {
    return { success: true, value: resUpdateProductJson };
  } else {
    return { success: false, value: null };
  }
}

export async function getProductsClient(accountId) {
  const productApiRoute = `/api/private/inventory/product/get?accountId=${accountId}`;

  const resGetProduct = await fetch(productApiRoute, {
    method: "GET",
  });
  const resGetProductJson = await resGetProduct.json();

  if (resGetProduct.status === 200) {
    return { success: true, value: resGetProductJson };
  } else {
    return { success: false, value: null };
  }
}

export async function deleteProductClient(productId) {
  const productApiRoute = `/api/private/inventory/product/delete`;

  const resDeleteProduct = await fetch(productApiRoute, {
    method: "POST",
    body: JSON.stringify({
      productId,
    }),
  });
  const resDeleteProductJson = await resDeleteProduct.json();

  if (resDeleteProduct.status === 200) {
    return { success: true, value: resDeleteProductJson };
  } else {
    return { success: false, value: null };
  }
}
