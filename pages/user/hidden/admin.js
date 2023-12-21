import React from "react";
import { nanoid } from "nanoid";
import prisma from "@/lib/prisma";

function Admin({ id }) {
  return <div>{id}</div>;
}

export async function getServerSideProps(context) {
  const products = await prisma.product.findMany();
  const pid = products.map((product) => product.id);

  const promiseUpdate = [];

  for (let i = 0; i < pid.length; i++) {
    const currId = pid[i];
    const productId = nanoid();

    const updateProduct = prisma.product.update({
      where: {
        id: parseInt(currId),
      },
      data: {
        productId,
      },
    });

    promiseUpdate.push(updateProduct);
  }

  try {
    const update = await Promise.all(promiseUpdate);

    const serial = JSON.parse(JSON.stringify(update));
    console.log("update", update);
    return {
      props: {
        update: serial,
      },
    };
  } catch (error) {
    console.log("error", error);
    return {
      props: {
        id: "error",
      },
    };
  }
}

export default Admin;
