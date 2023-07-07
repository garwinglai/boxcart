export async function createCategoryClient(category) {
  const categoryApiRoute = `/api/private/inventory/category/create`;

  const resCreateCategory = await fetch(categoryApiRoute, {
    method: "POST",
    body: JSON.stringify(category),
  });
  const resCreateCategoryJson = await resCreateCategory.json();

  if (resCreateCategory.status === 200) {
    return { success: true, value: resCreateCategoryJson };
  } else {
    return { success: false, value: resCreateCategoryJson };
  }
}

export async function updateCategoryClient(category) {
  const categoryApiRoute = `/api/private/inventory/category/update`;

  const resUpdateCategory = await fetch(categoryApiRoute, {
    method: "POST",
    body: JSON.stringify(category),
  });
  const resUpdateCategoryJson = await resUpdateCategory.json();

  if (resUpdateCategory.status === 200) {
    return { success: true, value: resUpdateCategoryJson };
  } else {
    return { success: false, value: resUpdateCategoryJson };
  }
}

export async function getCategoriesClient(accountId) {
  const categoryApiRoute = `/api/private/inventory/category/get?accountId=${accountId}`;

  const resGetCategory = await fetch(categoryApiRoute, {
    method: "GET",
  });
  const resGetCategoryJson = await resGetCategory.json();

  if (resGetCategory.status === 200) {
    return { success: true, value: resGetCategoryJson };
  } else {
    return { success: false, value: null };
  }
}

export async function deleteCategoryClient(categoryId) {
  const categoryApiRoute = `/api/private/inventory/category/delete`;

  const resDeleteCategory = await fetch(categoryApiRoute, {
    method: "POST",
    body: JSON.stringify(categoryId),
  });
  const resDeleteCategoryJson = await resDeleteCategory.json();

  if (resDeleteCategory.status === 200) {
    return { success: true, value: resDeleteCategoryJson };
  } else {
    return { success: false, value: null };
  }
}
