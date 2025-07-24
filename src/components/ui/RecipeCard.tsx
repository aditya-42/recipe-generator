import React from "react";
import Image from "next/image";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

type Props = {
  r: {
    id: number;
    title: string;
    image?: string;
    description?: string;
    matchedIngredients?: string[];
  };
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onRemoveBookmark?: () => void;
};

const RecipeCard: React.FC<Props> = ({
  r,
  isBookmarked,
  onBookmark,
  onRemoveBookmark,
}) => (
  <div className="flex flex-col gap-4 mb-4">
    <div className="flex gap-5 border mx-2 p-2 rounded-sm text-center">
      <div>
        <Image
          src={r.image || "https://static.photos/200x200/80.png"}
          alt={r.title}
          width={200}
          height={200}
          className="p-2 object-cover mb-2 rounded-xl"
        />
      </div>
      <div className="flex flex-col gap-4 items-start w-full justify-center text-left">
        <div className="flex justify-between items-center w-full">
          <h2 className="font-semibold">{r.title}</h2>
          {isBookmarked ? (
            <button
              onClick={onRemoveBookmark}
              className="flex items-center gap-1 text-sm px-3 py-1"
            >
              <BsBookmarkFill size={20} />
            </button>
          ) : (
            onBookmark && (
              <button
                onClick={onBookmark}
                className="flex items-center gap-1 text-sm px-3 py-1"
              >
                <BsBookmark size={20} />
              </button>
            )
          )}
        </div>

        {r.description && <p className="text-sm">{r.description}</p>}
        {r.matchedIngredients && (
          <div>
            <span className="font-bold text-xs">Matched Ingredient(s):</span>
            <span className="text-xs">{r.matchedIngredients.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RecipeCard;
