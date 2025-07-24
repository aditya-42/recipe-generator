# [RecipeWiz](https://recipe-generator-lake-five.vercel.app/)

Deployed Link - https://recipe-generator-lake-five.vercel.app/

A smart recipe finder built with **Next.js**, supporting search from:

<img width="402" height="676" alt="image" src="https://github.com/user-attachments/assets/09130e99-6e2b-4369-9fbb-4d44700da487" />







- Local dataset
- [Spoonacular API](https://spoonacular.com/food-api)
- OpenAI (GPT-3.5) for AI-generated recipe suggestions

Users can:
- Search ingredients with autosuggestions (debounced)
- Mix and match up to 5 ingredients
- Get matching recipes with image, description, and matched ingredients
- Bookmark favourite recipes (persisted to `localStorage`)
- Toggle theme mode (light/dark)

---

## Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/your-username/recipewiz.git
cd recipewiz
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

>  Register for keys below -
> - [Spoonacular API key](https://spoonacular.com/food-api)
> - [OpenAI API key](https://platform.openai.com/account/api-keys)

### 3. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features Overview

- **Ingredient Search**  
  Type to get autosuggestions from local or API sources (with debounce support).

- **Search Modes**
  - `Local`: Uses built-in ingredient and recipe data
  - `Spoonacular`: Fetches real-time recipe data via API
  - `OpenAI`: Prompts GPT-3.5 to generate recipe suggestions
 
- **Skeleton loading**  

- **Dynamic Recipe Cards**
  - Shows image, description, and matched ingredients
  - Supports saving (bookmarks) to `localStorage`

- **Bookmarks Page**
  - View and remove bookmarked recipes

- **Theme Toggle**
  - Supports light and dark mode (via system setting or manual toggle)

---

## Recipe matching logic 

```
function searchLocalRecipes(selectedIngredients: string[]) {
    return localRecipes
      .map((recipe, index) => {
        //convert each ingredient to smallcase and match with recipe ingredients
        const recipeIngs = recipe.ingredients.map((i) => i.toLowerCase());
        const matchedIngredients = selectedIngredients.filter((ing) =>
          recipeIngs.includes(ing.toLowerCase())
        );

        // return object with matched ingredients
        return {
          ...recipe,
          id: recipe.id ?? recipe.title + index,
          image: recipe.image ?? "https://static.photos/200x200/80.png",
          matchCount: matchedIngredients.length,
          matchedIngredients,
        };
      })
      .filter((recipe) => recipe.matchCount >= 1) // return every matched recipe
      .sort((a, b) => b.matchCount - a.matchCount); // sort according to number of matches
  }
```

## Tech Stack

| Technology       | Purpose                         |
|------------------|---------------------------------|
| Next.js 15       | React framework                 |
| TypeScript       | Static typing                   |
| Tailwind CSS     | Styling                         |
| React Icons      | UI icons                        |
| Spoonacular API  | Real ingredient/recipe search   |
| OpenAI API       | AI-generated recipe suggestions |

---

## Assumptions

- Public keys are used; no user auth
- Spoonacular API summary for recipe description not used; this is to prevent deplete precious free-tier credits. 
- Users will not exceed free-tier API limits

---

## Time Spent

~17 hours total:
- Core layout + search logic: 4h  
- API integrations + prompt handling: 6h  
- UI components + styling: 6h  
- Deployment: 1hr

---

## Improvements to follow 

-  Add a landing page and keep the API features behind auth.
-  Improve drop-down list to include keyboard and click interaction.
-  Add a recipe detail page.
-  Modularise helper functions into separate files.
-  Add unit tests for helper functions.
-  Add full accessibility and ARIA support.
-  Polish responsiveness for mobile and add toasts.
-  Reduce type and build errors.
-  Use React Query for API calls.

---
