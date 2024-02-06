import Link from "next/link";
import React from "react";

function DirectoryCard({ directory }) {
  return (
    <Link
      href={directory.path}
      className="p-4 shadow-md rounded hover:shadow-lg"
    >
      {directory.name}
    </Link>
  );
}

export default DirectoryCard;
