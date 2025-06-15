'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, ChefHat, Sparkles, Clock, Users, Zap } from 'lucide-react';

const BiteAdvisor = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("Hey there! I'm your cooking buddy. Upload a photo of your ingredients!");
  const fileInputRef = useRef(null);

  // Mock ingredient detection (replace with actual API)
  const mockDetectIngredients = (imageFile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockIngredients = ['tomato', 'onion', 'garlic', 'egg', 'cheese'];
        const randomIngredients = mockIngredients
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 2);
        resolve(randomIngredients);
      }, 2000);
    });
  };

  // Mock recipe fetching (replace with Spoonacular API)
  const mockFetchRecipes = (ingredients) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRecipes = [
          {
            id: 1,
            title: "Classic Tomato Omelette",
            readyInMinutes: 15,
            servings: 2,
            image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=200&fit=crop",
            matchedIngredients: ingredients.length,
            nutrition: { calories: 320, protein: 18, carbs: 8, fat: 24 }
          },
          {
            id: 2,
            title: "Cheesy Scrambled Eggs",
            readyInMinutes: 10,
            servings: 1,
            image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=200&fit=crop",
            matchedIngredients: ingredients.length - 1,
            nutrition: { calories: 280, protein: 16, carbs: 4, fat: 22 }
          },
          {
            id: 3,
            title: "Mediterranean Veggie Bowl",
            readyInMinutes: 25,
            servings: 2,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
            matchedIngredients: ingredients.length - 2,
            nutrition: { calories: 240, protein: 12, carbs: 18, fat: 14 }
          }
        ];
        resolve(mockRecipes);
      }, 1500);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setMascotMessage("Analyzing your ingredients... 🧐");

      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      try {
        const ingredients = await mockDetectIngredients(file);
        setDetectedIngredients(ingredients);
        setMascotMessage(`Found ${ingredients.length} ingredients! Let me find some recipes...`);

        const recipeResults = await mockFetchRecipes(ingredients);
        setRecipes(recipeResults);
        setMascotMessage("Perfect! I found some delicious recipes for you! 🍳");
      } catch (error) {
        setMascotMessage("Oops! Something went wrong. Try again?");
      } finally {
        setLoading(false);
      }
    }
  };

  const MascotAvatar = () => {
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 3000);

      return () => clearInterval(blinkInterval);
    }, []);

    return (
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <ChefHat className="w-12 h-12 text-white" />
        </div>
        <div className="absolute top-2 left-6 w-3 h-3 bg-white rounded-full flex items-center justify-center">
          <div className={`w-2 h-2 bg-black rounded-full transition-transform duration-150 ${isBlinking ? 'scale-y-0' : 'scale-y-100'}`} />
        </div>
        <div className="absolute top-2 right-6 w-3 h-3 bg-white rounded-full flex items-center justify-center">
          <div className={`w-2 h-2 bg-black rounded-full transition-transform duration-150 ${isBlinking ? 'scale-y-0' : 'scale-y-100'}`} />
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-white rounded-full" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              BiteAdvisor
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Cooking Assistant</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Cook Smart with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload a photo of your ingredients and let our AI chef find the perfect recipes for you
          </p>
        </div>

        {/* Mascot Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
          <MascotAvatar />
          <div className="text-center">
            <div className="bg-white rounded-2xl p-4 shadow-md inline-block max-w-md">
              <p className="text-gray-700 font-medium">{mascotMessage}</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />

            {!uploadedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-orange-300 rounded-2xl p-12 hover:border-orange-400 transition-colors cursor-pointer bg-gradient-to-br from-orange-50 to-red-50"
              >
                <Camera className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Your Ingredients</h3>
                <p className="text-gray-500">Click to take a photo or upload from gallery</p>
              </div>
            ) : (
              <div className="space-y-6">
                <img
                  src={uploadedImage}
                  alt="Uploaded ingredients"
                  className="max-w-md mx-auto rounded-2xl shadow-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Upload New Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">AI is working its magic...</p>
            </div>
          </div>
        )}

        {/* Detected Ingredients */}
        {detectedIngredients.length > 0 && !loading && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Detected Ingredients</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {detectedIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Recommended Recipes</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">{recipe.title}</h4>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-orange-600">
                        {recipe.matchedIngredients} ingredients matched
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {recipe.nutrition.calories} cal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h3>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-orange-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Cooking Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-semibold">{selectedRecipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Servings:</span>
                        <span className="font-semibold">{selectedRecipe.servings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Nutrition</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors"
                >
                  Start Cooking!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiteAdvisor;
