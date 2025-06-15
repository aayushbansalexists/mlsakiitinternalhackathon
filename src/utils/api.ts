// src/utils/api.ts

/**
 * Recipe interface defining the structure of recipe data
 * Used throughout the application for type safety
 */
export interface Recipe {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  image: string;
  matchedIngredients: number;
  missedIngredients: number;
  sourceUrl?: string;
  summary: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  instructions: any[];
}

/**
 * Demo recipe data to reduce API calls and provide fallback content
 * Organized by ingredient combinations for quick matching
 * Key format: comma-separated sorted ingredients
 */
const DEMO_RECIPES: { [key: string]: Recipe[] } = {
  // 'tomato,onion,garlic,egg,cheese': [
  //   {
  //     id: 1001,
  //     title: "Classic Tomato Omelette",
  //     readyInMinutes: 15,
  //     servings: 2,
  //     image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=200&fit=crop",
  //     matchedIngredients: 5,
  //     missedIngredients: 0,
  //     summary: "A delicious and fluffy omelette with fresh tomatoes, onions, and cheese.",
  //     nutrition: { calories: 320, protein: 18, carbs: 8, fat: 24 },
  //     instructions: []
  //   },
  //   {
  //     id: 1002,
  //     title: "Mediterranean Veggie Scramble",
  //     readyInMinutes: 12,
  //     servings: 1,
  //     image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop",
  //     matchedIngredients: 4,
  //     missedIngredients: 1,
  //     summary: "Scrambled eggs with Mediterranean vegetables and herbs.",
  //     nutrition: { calories: 280, protein: 16, carbs: 12, fat: 18 },
  //     instructions: []
  //   }
  // ],
  // 'chicken,rice,vegetables,soy sauce': [
  //   {
  //     id: 2001,
  //     title: "Asian Chicken Fried Rice",
  //     readyInMinutes: 20,
  //     servings: 3,
  //     image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=200&fit=crop",
  //     matchedIngredients: 4,
  //     missedIngredients: 0,
  //     summary: "Classic fried rice with tender chicken and mixed vegetables.",
  //     nutrition: { calories: 380, protein: 22, carbs: 45, fat: 12 },
  //     instructions: []
  //   },
  //   {
  //     id: 2002,
  //     title: "Chicken Teriyaki Bowl",
  //     readyInMinutes: 25,
  //     servings: 2,
  //     image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=300&h=200&fit=crop",
  //     matchedIngredients: 3,
  //     missedIngredients: 1,
  //     summary: "Grilled chicken over rice with steamed vegetables and teriyaki sauce.",
  //     nutrition: { calories: 420, protein: 28, carbs: 48, fat: 14 },
  //     instructions: []
  //   }
  // ],
  // 'pasta,cheese,garlic,olive oil,basil': [
  //   {
  //     id: 3001,
  //     title: "Garlic Parmesan Pasta",
  //     readyInMinutes: 18,
  //     servings: 4,
  //     image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
  //     matchedIngredients: 5,
  //     missedIngredients: 0,
  //     summary: "Creamy garlic parmesan pasta with fresh basil and extra virgin olive oil.",
  //     nutrition: { calories: 445, protein: 16, carbs: 52, fat: 18 },
  //     instructions: []
  //   },
  //   {
  //     id: 3002,
  //     title: "Italian Herb Pasta",
  //     readyInMinutes: 22,
  //     servings: 3,
  //     image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&h=200&fit=crop",
  //     matchedIngredients: 4,
  //     missedIngredients: 1,
  //     summary: "Traditional Italian pasta with aromatic herbs, garlic, and grated cheese.",
  //     nutrition: { calories: 385, protein: 14, carbs: 48, fat: 16 },
  //     instructions: []
  //   },
  //   {
  //     id: 3003,
  //     title: "Basil Pesto Linguine",
  //     readyInMinutes: 15,
  //     servings: 2,
  //     image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=300&h=200&fit=crop",
  //     matchedIngredients: 4,
  //     missedIngredients: 1,
  //     summary: "Fresh basil pesto linguine with garlic, olive oil, and parmesan cheese.",
  //     nutrition: { calories: 520, protein: 18, carbs: 58, fat: 24 },
  //     instructions: []
  //   }
  // ]
};

/**
 * Converts an image file to base64 string format
 * Required for sending images to Google's Gemini API
 * 
 * @param imageFile - The image file to convert
 * @returns Promise<string> - Base64 encoded string without data URL prefix
 */
const convertImageToBase64 = (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (data:image/jpeg;base64,) to get pure base64
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
};

/**
 * Uses Google's Gemini API to detect ingredients from an uploaded image
 * FIXED: Updated to use the correct Gemini 1.5 Flash model endpoint
 * 
 * @param imageFile - The image file containing ingredients to analyze
 * @returns Promise<string[]> - Array of detected ingredient names
 * @throws Error if API key is missing or API call fails
 */
export const detectIngredientsWithGemini = async (imageFile: File): Promise<string[]> => {
  // Check for API key in environment variables
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file');
  }

  // FIXED: Use the correct Gemini 1.5 Flash endpoint
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    // Convert the uploaded image to base64 format
    console.log('Converting image to base64...');
    const base64Image = await convertImageToBase64(imageFile);

    // Prepare the request payload for Gemini API
    const requestBody = {
      contents: [{
        parts: [
          {
            // Detailed prompt to get accurate ingredient detection
            text: "Analyze this image and identify all visible food ingredients. Return ONLY a comma-separated list of ingredient names with no additional text. Be specific about what you can clearly see. For example: tomato, onion, garlic, cheese, eggs. Only list actual food ingredients, not dishes or cooking utensils."
          },
          {
            // Include the base64 image data
            inline_data: {
              mime_type: imageFile.type,
              data: base64Image
            }
          }
        ]
      }],
      // Configuration to get concise, focused responses
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent results
        maxOutputTokens: 200, // Limit response length
        topP: 1,
        topK: 32
      }
    };

    console.log('Sending image to Gemini API...');
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // Check if the API request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);

    // Validate the response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Extract the ingredients text from the response
    const ingredientsText = data.candidates[0].content.parts[0].text.trim();
    console.log('Raw ingredients text:', ingredientsText);

    // Parse and clean up the comma-separated ingredient list
    const ingredients = ingredientsText
      .split(',')
      .map((ingredient: string) => ingredient.trim().toLowerCase())
      .filter((ingredient: string) =>
        ingredient.length > 0 &&
        ingredient !== 'none' &&
        !ingredient.includes('no ingredients') &&
        !ingredient.includes('cannot identify')
      );

    console.log('Parsed ingredients:', ingredients);
    return ingredients;

  } catch (error) {
    console.error('Error in detectIngredientsWithGemini:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error('Gemini API endpoint not found. Please check your API configuration.');
      } else if (error.message.includes('403')) {
        throw new Error('Gemini API access denied. Please check your API key permissions.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid request to Gemini API. Please check the image format.');
      }
    }

    throw new Error('Failed to detect ingredients from image. Please try again.');
  }
};


/* Fetches recipes based on detected ingredients
 * Uses demo data first for efficiency, falls back to Spoonacular API
   * 
* @param ingredients - Array of ingredient names
 * @returns Promise < Recipe[] > - Array of matching recipes
   */
export const fetchRecipesWithSpoonacular = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    console.log('Searching for recipes with ingredients:', ingredients);

    // Create a sorted key for consistent demo data matching
    const ingredientKey = ingredients.sort().join(',');
    const demoKeys = Object.keys(DEMO_RECIPES);

    // Look for demo data that matches the detected ingredients
    // Requires at least 2 matching ingredients for a match
    const matchingKey = demoKeys.find(key => {
      const keyIngredients = key.split(',');
      const matchCount = ingredients.filter(ing =>
        keyIngredients.some(keyIng =>
          keyIng.includes(ing) || ing.includes(keyIng)
        )
      ).length;
      return matchCount >= 2; // Minimum 2 ingredients must match
    });

    // Use demo data if available (saves API calls and provides instant results)
    if (matchingKey) {
      console.log('✅ Using demo data for ingredients:', ingredients);
      return DEMO_RECIPES[matchingKey];
    }

    // If no demo data matches, attempt to use Spoonacular API
    console.warn('⚠️ No demo data found, attempting Spoonacular API...');
    return await fetchFromSpoonacularAPI(ingredients);

  } catch (error) {
    console.error('Error fetching recipes:', error);

    // Fallback to first available demo recipe set
    const fallbackRecipes = DEMO_RECIPES[Object.keys(DEMO_RECIPES)[0]] || [];
    console.log('🔄 Using fallback demo recipes');
    return fallbackRecipes;
  }
};

/**
 * Makes actual API calls to Spoonacular for recipe data
 * Only used when demo data doesn't provide a good match
 * 
 * @param ingredients - Array of ingredient names
 * @returns Promise<Recipe[]> - Array of recipes from Spoonacular API
 */
const fetchFromSpoonacularAPI = async (ingredients: string[]): Promise<Recipe[]> => {
  const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

  if (!SPOONACULAR_API_KEY) {
    throw new Error('Spoonacular API key not found. Please add NEXT_PUBLIC_SPOONACULAR_API_KEY to your .env.local file');
  }

  const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
  const ingredientsParam = ingredients.join(',+');

  console.log('🔍 Searching Spoonacular for recipes...');

  // Step 1: Search for recipes by ingredients
  const searchUrl = `${SPOONACULAR_BASE_URL}/findByIngredients?ingredients=${ingredientsParam}&number=6&ranking=1&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    throw new Error(`Spoonacular search error: ${searchResponse.status} - ${searchResponse.statusText}`);
  }

  const searchResults = await searchResponse.json();

  if (searchResults.length === 0) {
    console.log('No recipes found on Spoonacular');
    return [];
  }

  // Step 2: Get detailed information for the top recipes (limit to 4 to save API quota)
  const recipeIds = searchResults.slice(0, 4).map((recipe: any) => recipe.id);
  const bulkUrl = `${SPOONACULAR_BASE_URL}/informationBulk?ids=${recipeIds.join(',')}&includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;

  console.log('📊 Fetching detailed recipe information...');
  const detailResponse = await fetch(bulkUrl);
  if (!detailResponse.ok) {
    throw new Error(`Spoonacular details error: ${detailResponse.status} - ${detailResponse.statusText}`);
  }

  const detailedRecipes = await detailResponse.json();

  // Step 3: Format the recipes to match our Recipe interface
  const formattedRecipes: Recipe[] = detailedRecipes.map((recipe: any, index: number) => {
    const searchResult = searchResults[index];

    return {
      id: recipe.id,
      title: recipe.title,
      readyInMinutes: recipe.readyInMinutes || 30,
      servings: recipe.servings || 2,
      image: recipe.image || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=300&h=200&fit=crop',
      matchedIngredients: searchResult.usedIngredientCount || 0,
      missedIngredients: searchResult.missedIngredientCount || 0,
      sourceUrl: recipe.sourceUrl,
      summary: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : 'No description available.',
      nutrition: {
        calories: Math.round(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0),
        protein: Math.round(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0),
        carbs: Math.round(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0),
        fat: Math.round(recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0)
      },
      instructions: recipe.instructions || recipe.analyzedInstructions || []
    };
  });

  // Sort by number of matched ingredients (best matches first)
  return formattedRecipes.sort((a, b) => b.matchedIngredients - a.matchedIngredients);
};

/**
 * Main orchestration function that processes an image and returns recipes
 * This is the primary function to call from your React components
 * 
 * @param imageFile - The uploaded image file containing ingredients
 * @returns Promise<{ingredients: string[], recipes: Recipe[]}> - Detected ingredients and matching recipes
 * @throws Error with descriptive message if any step fails
 */
export const processImageAndGetRecipes = async (imageFile: File) => {
  try {
    console.log('🚀 Starting image processing pipeline...');

    // Step 1: Use Gemini AI to detect ingredients from the image
    console.log('🔍 Step 1: Detecting ingredients with Gemini AI...');
    const ingredients = await detectIngredientsWithGemini(imageFile);

    if (ingredients.length === 0) {
      throw new Error('No ingredients detected in the image. Please try a clearer image with visible ingredients.');
    }

    console.log('✅ Detected ingredients:', ingredients);

    // Step 2: Find recipes that use those ingredients
    console.log('👨‍🍳 Step 2: Finding matching recipes...');
    const recipes = await fetchRecipesWithSpoonacular(ingredients);

    console.log(`✅ Found ${recipes.length} matching recipes`);

    return {
      ingredients,
      recipes
    };

  } catch (error) {
    console.error('❌ Error in processImageAndGetRecipes:', error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`Recipe processing failed: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while processing your image. Please try again.');
    }
  }
};
