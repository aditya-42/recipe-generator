"use client";

import React from "react";
import { ModeToggle } from "../theme-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsBookmark } from "react-icons/bs";
import { Button } from "./button";

function NavBar() {
  const router = useRouter();

  return (
    <div className="px-10 py-5 lg:px-40 flex flex-row justify-between items-center border-b-1 border-gray-200">
      <div className="text-2xl font-extrabold">
        <Link href="/">RecipeWiz</Link>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="cursor-pointer "
          onClick={() => router.push("/bookmarks")}
          aria-label="View Bookmarks"
        >
          <BsBookmark size={20} />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}

export default NavBar;
