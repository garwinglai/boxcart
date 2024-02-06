import React from "react";
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import DirectoryCard from "@/components/admin/DirectoryCard";

const directory = [{ name: "Email", path: "/admin/email" }];

function Admin() {
  return (
    <div className="p-4">
      {directory.map((item, index) => {
        return <DirectoryCard key={index} directory={item} />;
      })}
    </div>
  );
}

export default Admin;

Admin.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
