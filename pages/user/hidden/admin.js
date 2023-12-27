import React, { useEffect } from "react";
import prisma from "@/lib/prisma";

import { useRouter } from "next/router";

function Admin() {
  const { push } = useRouter();
  useEffect(() => {
    push("https://home.boxcart.shop");
  }, []);

  return <div>admin</div>;
}

export default Admin;

// export async function getServerSideProps(context) {
//   const accounts = await prisma.account.findMany();

//   const promise = [];

//   for (let i = 0; i < accounts.length; i++) {
//     const account = accounts[i];
//     const { id, subdomain } = account;

//     const fullDomain = "boxcart.shop/" + subdomain;

//     const updateAccount = prisma.account.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: {
//         fullDomain,
//       },
//     });

//     promise.push(updateAccount);
//   }

//   try {
//     const update = await Promise.all(promise);
//     const serial = JSON.parse(JSON.stringify(update));
//     return {
//       props: {
//         users: serial,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       props: {
//         users: [],
//       },
//     };
//   }
// }
