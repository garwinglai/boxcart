import React from "react";
import prisma from "@/lib/prisma";

function admin() {
  return <div>admin</div>;
}

export default admin;

export async function getServerSideProps(context) {
  const accounts = await prisma.account.findMany();

  const promise = [];

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const { id, subdomain } = account;

    const fullDomain = "boxcart.shop/" + subdomain;

    const updateAccount = prisma.account.update({
      where: {
        id: parseInt(id),
      },
      data: {
        fullDomain,
      },
    });

    promise.push(updateAccount);
  }

  try {
    const update = await Promise.all(promise);
    const serial = JSON.parse(JSON.stringify(update));
    return {
      props: {
        users: serial,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        users: [],
      },
    };
  }
}
