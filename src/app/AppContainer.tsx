"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import localIngredients from "@/data/ingredients";
import localRecipes from "@/data/recipes";
import { Input } from "@/components/ui/input";
import Chip from "@/components/ui/Chip";
import RecipeCard from "@/components/ui/RecipeCard";
import { MdClear } from "react-icons/md";
import { Loader2, Search } from "lucide-react";
import useDebounce from "../lib/useDebounce";
import RecipeCardSkeleton from "@/components/ui/RecipeCardSkeleton";

function AppContainer() {
  // Use State declarations

  const [inputMode, setInputMode] = useState<
    "local" | "spoonacular" | "openai"
  >("local");
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState([]);
  const debouncedQuery = useDebounce(query, 500);
  const maxIngredientCount = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<any[]>([]);

  // Fetch the localstorage recipe items
  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedRecipes");
    if (stored) {
      setBookmarkedRecipes(JSON.parse(stored));
    }
  }, []);

  // Bookmark functions

  // Add bookmark
  const handleBookmark = (recipe: any) => {
    if (bookmarkedRecipes.some((r) => r.id === recipe.id)) return;
    const updated = [recipe, ...bookmarkedRecipes];
    setBookmarkedRecipes(updated);
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(updated));
  };

  // Remove bookmark
  const handleRemoveBookmark = (id: number) => {
    const updated = bookmarkedRecipes.filter((r) => r.id !== id);
    setBookmarkedRecipes(updated);
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(updated));
  };

  // Check if the item is already bookmarked
  const isBookmarked = (recipeId: number) =>
    bookmarkedRecipes.some((r) => r.id === recipeId);

  // When user selects autocomplete item
  const handleSelect = (ingredientName: string) => {
    const lowerName = ingredientName.toLowerCase();

    const alreadySelected = selectedIngredients.some(
      (i) => i.toLowerCase() === lowerName
    );

    if (alreadySelected) {
      alert(`${ingredientName} is already selected`);
      return;
    }

    if (selectedIngredients.length >= maxIngredientCount) {
      alert(`You can select up to ${maxIngredientCount} ingredients`);
      return;
    }

    setSelectedIngredients((prev) => [...prev, ingredientName]);

    setQuery("");
    setSuggestions([]);
  };

  // fetch recipes
  const fetchRecipes = async () => {
    if (selectedIngredients.length < 1) {
      alert("Please select at least 1 ingredient.");
      return;
    }

    setIsLoading(true);

    try {
      // Local data
      if (inputMode === "local") {
        const results = searchLocalRecipes(selectedIngredients);
        setRecipes(results);
      }
      // Fetch from spoonacular API
      else if (inputMode === "spoonacular") {
        const ingredientsStr = selectedIngredients.join(",");
        const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsStr}&number=3&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setRecipes(data);
      }

      // Fetch from OpenAI

      if (inputMode === "openai") {
        // Prompt
        const prompt = `Suggest me 3 recipes using ${selectedIngredients.join(
          ", "
        )}. Return a JSON array where each object has a current time as id, title, ingredients, and description. Use double quotes for all keys and string values.`;

        try {
          const res = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
              }),
            }
          );

          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || "";
          const match = text.match(/\[.*\]/s);
          const jsonText = match ? match[0] : "[]";

          const fixedJson = jsonText.replace(
            /([,{\s])([a-zA-Z0-9_]+):/g,
            '$1"$2":'
          );
          const parsed = JSON.parse(fixedJson);

          setRecipes(parsed.slice(0, 3));
        } catch (err) {
          console.error("Failed to fetch OpenAI recipes:", err);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search recipes from local data logic
  function searchLocalRecipes(selectedIngredients: string[]) {
    return localRecipes
      .map((recipe, index) => {
        //convert each ingredient to small case and match
        const recipeIngs = recipe.ingredients.map((i) => i.toLowerCase());
        const matchedIngredients = selectedIngredients.filter((ing) =>
          recipeIngs.includes(ing.toLowerCase())
        );

        //
        return {
          ...recipe,
          id: recipe.id ?? recipe.title + index,
          image: recipe.image ?? "https://static.photos/200x200/80.png",
          matchCount: matchedIngredients.length,
          matchedIngredients,
        };
      })
      .filter((recipe) => recipe.matchCount >= 1)
      .sort((a, b) => b.matchCount - a.matchCount);
  }

  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setRecipes([]);
    }
  }, [selectedIngredients]);

  // Suggestions fetching
  useEffect(() => {
    // Ingredients loaded from local data
    if (inputMode === "local" || inputMode === "openai") {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const filtered = localIngredients.filter((ing) =>
        ing.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else if (inputMode === "spoonacular") {
      async function fetchSuggestions() {
        if (!debouncedQuery.trim()) {
          setSuggestions([]);
          return;
        }

        try {
          setLoadingSuggestions(true);

          const url = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${debouncedQuery}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();

          if (!Array.isArray(data)) {
            throw new Error("Unexpected response");
          }

          setSuggestions(data);
          if (data.length === 0 && debouncedQuery.length >= 3) {
            console.log("Ingredient not found");
          }
        } catch (err) {
          console.log("Failed to fetch ingredients.");
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      }

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [inputMode, debouncedQuery, query]);

  // JSX starts

  return (
    <div className="flex justify-center min-h-screen px-3 py-6">
      <div className="flex flex-col gap-10 max-w-2xl w-full">
        <h1 className="text-center font-bold text-3xl sm:text-4xl">
          Find your favorite Recipes!
        </h1>

        {/* Input Card */}
        <Card className="text-center px-3 flex flex-col gap-3">
          <div className="relative w-full">
            {/* Input component */}
            <Input
              type="text"
              placeholder="Search for ingredients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            {query && (
              <MdClear
                size={18}
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-white"
              />
            )}
          </div>

          {/* Ingredient Suggestions start by entering 2 characters */}

          {query.trim().length > 2 && (
            <div className="relative">
              {loadingSuggestions ? (
                <ul className="border rounded-lg mt-[-10px] max-h-[150px] overflow-y-auto p-0 list-none shadow-sm pb-2">
                  {[...Array(3)].map((_, idx) => (
                    <li key={idx} className="animate-pulse px-3 py-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                    </li>
                  ))}
                </ul>
              ) : suggestions.length > 0 ? (
                <ul className="border rounded-lg mt-[-10px] max-h-[150px] overflow-y-auto p-0 list-none shadow-sm pb-1 z-10">
                  {suggestions.map((sug: any) => (
                    <li
                      key={sug.id || sug.name}
                      className="cursor-pointer px-3 py-2 text-left flex items-center gap-2"
                      onClick={() => handleSelect(sug.name)}
                    >
                      <Search size={16} />
                      <span className="text-sm">{sug.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm mt-1 px-2 text-red-500">
                  Ingredient not found
                </p>
              )}
            </div>
          )}

          {/* Selected ingredients chips */}
          <div>
            <div className="flex gap-5 items-center">
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.length === 0 ? (
                  <p></p>
                ) : (
                  selectedIngredients.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      onRemove={() =>
                        setSelectedIngredients((prev) =>
                          prev.filter((i) => i !== item)
                        )
                      }
                    />
                  ))
                )}
              </div>
              <div className="text-left text-sm">
                {selectedIngredients.length > 0
                  ? `${selectedIngredients.length}/${maxIngredientCount}`
                  : ""}
              </div>
            </div>
          </div>

          {/* Select Mode dropdown */}
          <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-row gap-4 justify-between">
              <Select
                value={inputMode}
                onValueChange={(val) =>
                  setInputMode(val as "local" | "spoonacular" | "openai")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Data</SelectItem>
                  <SelectItem value="spoonacular">Spoonacular API</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={fetchRecipes}
              disabled={
                isLoading ||
                selectedIngredients.length < 1 ||
                selectedIngredients.length > maxIngredientCount
              }
              className={`w-fit flex items-center gap-2 ${
                selectedIngredients.length < 1 ||
                selectedIngredients.length > maxIngredientCount
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Find Recipes
            </Button>
          </div>
        </Card>

        {/* Results Section      */}

        {!isLoading && selectedIngredients.length === 0 && (
          <p className="text-center text-sm mt-4">
            Please select upto 5 ingredients to search for recipes.
          </p>
        )}

        {isLoading ? (
          <RecipeCardSkeleton />
        ) : recipes.length > 0 ? (
          <div>
            <h2 className="text-center text-lg mb-10 font-extrabold">
              Recipes found:{" "}
            </h2>
            <Card className="text-center p-4 mt-4">
              {recipes.map((r: any) => (
                <RecipeCard
                  key={r.id}
                  r={r}
                  isBookmarked={isBookmarked(r.id)}
                  onBookmark={() => handleBookmark(r)}
                  onRemoveBookmark={() => handleRemoveBookmark(r.id)}
                />
              ))}
            </Card>
          </div>
        ) : selectedIngredients.length > 0 ? (
          <div>
            <h2 className="text-center text-lg mb-10 font-extrabold">
              Results:{" "}
            </h2>
            <p className="text-center text-sm">No recipes found.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AppContainer;
