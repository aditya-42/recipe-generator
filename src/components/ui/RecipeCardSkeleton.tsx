"use client";

import { Skeleton } from "./skeleton";

const RecipeCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-5 border mx-2 p-2 rounded-sm animate-pulse">
      {/* Image skeleton */}
      <Skeleton className="w-32 h-32 rounded" />

      {/* Text section */}
      <div className="flex flex-col gap-5 flex-1">
        <Skeleton className="h-5 rounded w-3/4" />
        <Skeleton className="h-4 rounded w-full" />
        <Skeleton className="h-4 rounded w-2/3" />
      </div>
    </div>
  </div>
);

export default RecipeCardSkeleton;
