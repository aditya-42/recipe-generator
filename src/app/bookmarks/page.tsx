"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import RecipeCard from "@/components/ui/RecipeCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiLeftArrowCircle } from "react-icons/bi";

export default function BookmarksPage() {
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<any[]>([]);

  // Fetch the recipes from local storage
  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedRecipes");
    if (stored) {
      setBookmarkedRecipes(JSON.parse(stored));
    }
  }, []);

  // Remove the bookmarks
  const handleRemoveBookmark = (id: number) => {
    const updated = bookmarkedRecipes.filter((r) => r.id !== id);
    setBookmarkedRecipes(updated);
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(updated));
  };

  return (
    <div className="h-screen p-4 max-w-4xl mx-auto">
      <Link href="/">
        <Button>
          <BiLeftArrowCircle /> Back to Search
        </Button>
      </Link>

      <h1 className="text-2xl text-center md:text-left font-bold mb-4 flex items-center gap-2 mt-4">
        Bookmarked Recipes
      </h1>

      {bookmarkedRecipes.length === 0 ? (
        <p>No bookmarked recipes yet.</p>
      ) : (
        <Card className="p-4">
          {bookmarkedRecipes.map((r) => (
            <RecipeCard
              key={r.id}
              r={r}
              isBookmarked={true}
              onRemoveBookmark={() => handleRemoveBookmark(r.id)}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
