import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://static.photos/**"),
      new URL("https://img.spoonacular.com/recipes/**"),
    ],
  },
};

export default nextConfig;
