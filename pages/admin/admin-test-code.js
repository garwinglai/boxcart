import React from "react";
import prisma from "@/lib/prisma";

function AdminTest() {
  return <div>AdminTest</div>;
}

export default AdminTest;

export async function getServerSideProps(context) {
  const getAccounts = await prisma.account.findMany();
  // get all accountIds and lng and lat
  const accountIds = getAccounts.map((account) => {
    return {
      accountId: account.id,
      lat: account.lat,
      lng: account.lng,
      geohash: account.geohash,
    };
  });

  for (let i = 0; i < accountIds.length; i++) {
    const { accountId, lat, lng, geohash } = accountIds[i];

    // update al products to have lat and lng for account
    await prisma.product.updateMany({
      where: {
        accountId: accountId,
      },
      data: {
        lat: lat,
        lng: lng,
        geohash,
      },
    });

    // do the same for didgitalproduct
    await prisma.digitalProduct.updateMany({
      where: {
        accountId: accountId,
      },
      data: {
        lat: lat,
        lng: lng,
        geohash,
      },
    });
  }

  return {
    props: {},
  };
}
