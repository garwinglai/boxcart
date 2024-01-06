import React, { useEffect, useState } from "react";
import { Avatar, Divider, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import boxcart_logo from "@/public/images/logos/boxcart_logo_full.png";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "@/components/global/designs/SearchBar";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ProductCard from "@/components/extension/ProductCard";
import prisma from "@/lib/prisma";
import Image from "next/image";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

function Extension() {
  const [products, setProducts] = useState([]);

  const { push } = useRouter();

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      // Your popup script logic goes here
      console.log("Popup loaded yessir!");
    });
    const fetchProducts = async () => {
      const route = "/api/public/extension/get-products";
      const res = await fetch(route, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!data.error) {
        setProducts(data.products);
      }
    };

    fetchProducts();
  }, []);

  const navToAccount = () => {
    // push("/account");
  };

  const closeExtension = () => {};

  const toggleFilter = () => {};

  return (
    <main className="p-4 min-w-[600px] min-h-screen bg-blue-100">
      <div>
        <div className="flex justify-between items-center">
          <h1>BoxCart</h1>
          {/* <div className="relative w-20 h-full">
            <Image
              src={boxcart_logo}
              alt="boxcart logo"
              fill
              className="w-full h-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div> */}
          <div className="flex items-center">
            <IconButton onClick={navToAccount}>
              <Avatar sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton onClick={closeExtension}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <SearchBar placeholder="Search products" />
          <IconButton onClick={toggleFilter}>
            <FilterListOutlinedIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <div className="py-4">
        <Divider />
      </div>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

export default Extension;

// export async function getServerSideProps() {
//   try {
//     const products = await prisma.product.findMany({
//       include: {
//         account: {
//           select: {
//             fullDomain: true,
//           },
//         },
//       },
//     });
//     const serializedProducts = JSON.parse(JSON.stringify(products));

//     return {
//       props: {
//         products: serializedProducts,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         products: [],
//       },
//     };
//   }
// }
