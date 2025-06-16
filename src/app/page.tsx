'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, ChefHat, Sparkles, Clock, Users, Zap } from 'lucide-react';
import {
  processImageAndGetRecipes, Recipe
} from '../utils/api';
import 'animate.css';
import EnhancedMascotSection from '@/components/EnhancedMascotSection'
import GeminiChatbot from '@/components/GeminiChatBot';

const BiteAdvisor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mascotMessage, setMascotMessage] = useState<string>("Hey there! I'm your cooking buddy. Upload a photo of your ingredients!");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setMascotMessage("Analyzing your ingredients... 🧐");

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    try {
      // Use the real API functions
      const result = await processImageAndGetRecipes(file);

      setDetectedIngredients(result.ingredients);
      setMascotMessage(`Found ${result.ingredients.length} ingredients! Let me find some recipes...`);

      setRecipes(result.recipes);
      setMascotMessage("Perfect! I found some delicious recipes for you! 🍳");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Try again?';
      setError(errorMessage);
      setMascotMessage("Oops! Something went wrong. Try again?");
      console.error('Error processing image:', err);
    } finally {
      setLoading(false);
    }
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
        <div className="text-center mb-12 animate__animated animate__fadeIn">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Cook Smart with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload a photo of your ingredients and let our AI chef find the perfect recipes for you
          </p>
        </div>

        {/* Mascot Section */}
        <EnhancedMascotSection mascotMessage={mascotMessage} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-8 animate__animated animate__shakeX">
            <div className="flex items-center">
              <span className="font-semibold">Error: </span>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20 animate__animated animate__fadeInUp animate__delay-1s">
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
                className="border-2 border-dashed border-orange-300 rounded-2xl p-12 hover:border-orange-400 transition-colors cursor-pointer bg-gradient-to-br from-orange-50 to-red-50 hover:animate__animated hover:animate__pulse"
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
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Upload New Image'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20 animate__animated animate__fadeIn">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">AI is working its magic...</p>
              <p className="text-sm text-gray-500 mt-2">
                {detectedIngredients.length === 0 ? 'Detecting ingredients...' : 'Finding recipes...'}
              </p>
            </div>
          </div>
        )}

        {/* Detected Ingredients */}
        {detectedIngredients.length > 0 && !loading && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20 animate__animated animate__slideInUp">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Detected Ingredients</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {detectedIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md animate__animated animate__bounceIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Recommended Recipes</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer animate__animated animate__zoomIn hover:animate__pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-600">
                        ✅ {recipe.matchedIngredients} matched
                      </span>
                      {recipe.missedIngredients > 0 && (
                        <span className="text-sm font-semibold text-orange-600">
                          ➕ {recipe.missedIngredients} missing
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800">
                        🔥 {Math.round(recipe.nutrition.calories)} cal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <GeminiChatbot />

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate__animated animate__fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate__animated animate__zoomIn">
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

                {/* Recipe Summary */}
                {selectedRecipe.summary && (
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedRecipe.summary.substring(0, 200)}...
                    </p>
                  </div>
                )}

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
                      <div className="flex justify-between">
                        <span>Matched:</span>
                        <span className="font-semibold text-green-600">{selectedRecipe.matchedIngredients}</span>
                      </div>
                      {selectedRecipe.missedIngredients > 0 && (
                        <div className="flex justify-between">
                          <span>Missing:</span>
                          <span className="font-semibold text-orange-600">{selectedRecipe.missedIngredients}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Nutrition</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-semibold">{Math.round(selectedRecipe.nutrition.calories)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-semibold">{Math.round(selectedRecipe.nutrition.protein)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-semibold">{Math.round(selectedRecipe.nutrition.carbs)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-semibold">{Math.round(selectedRecipe.nutrition.fat)}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedRecipe.sourceUrl && (
                    <a
                      href={selectedRecipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors text-center block"
                    >
                      View Full Recipe
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-colors"
                  >
                    Close Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiteAdvisor;
