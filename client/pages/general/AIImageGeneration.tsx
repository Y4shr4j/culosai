import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Menu,
  X,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../src/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AspectRatio {
  id: string;
  ratio: string;
}

interface CategoryOption {
  id: string;
  label: string;
}

const aspectRatios: AspectRatio[] = [
  { id: "2:3", ratio: "2:3" },
  { id: "3:2", ratio: "3:2" },
  { id: "3:4", ratio: "3:4" },
  { id: "4:3", ratio: "4:3" },
];

const categoryOptions: CategoryOption[] = [
  { id: "option1", label: "Option 1" },
  { id: "option2", label: "Option 2" },
  { id: "option3", label: "Option 3" },
  { id: "option4", label: "Option 4" },
  { id: "option5", label: "Option 5" },
  { id: "option6", label: "Option 6" },
  { id: "option7", label: "Option 7" },
  { id: "option8", label: "Option 8" },
  { id: "option9", label: "Option 9" },
  { id: "option10", label: "Option 10" },
  { id: "option11", label: "Option 11" },
  { id: "option12", label: "Option 12" },
  { id: "option13", label: "Option 13" },
  { id: "option14", label: "Option 14" },
  { id: "option15", label: "Option 15" },
  { id: "option16", label: "Option 16" },
  { id: "option17", label: "Option 17" },
  { id: "option18", label: "Option 18" },
  { id: "option19", label: "Option 19" },
  { id: "option20", label: "Option 20" },
];

export default function AIImageGeneration() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(true);
  const [aspectRatioExpanded, setAspectRatioExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("2:3");
  const [selectedCategory, setSelectedCategory] = useState("option1");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await api.get("/auth/tokens");
        setTokens(response.data.tokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };
    fetchTokens();
  }, []);

  const handleLogout = async () => {
    try {
              await api.post("/auth/logout");
      setUser(null);
      setTokens(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      // Still redirect even if logout fails
      window.location.href = "/login";
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const response = await api.post("/api/generate", {
        prompt: promptText,
        aspectRatio: selectedAspectRatio,
        category: selectedCategory,
        type: "image",
      });
      setGeneratedImage(response.data.imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate image");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setPromptText("");
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2A2A2A] via-[#2A2A2A] to-[#513238] font-norwester">
      {/* Navbar */}
      <Navbar user={user} tokens={tokens} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-culosai-cream text-3xl md:text-4xl lg:text-5xl font-norwester">
            Generate Image
          </h1>
        </div>

        {/* Image Preview Area */}
        <div className="bg-[#171717] rounded-3xl p-8 md:p-12 lg:p-16 mb-8 md:mb-12">
          <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[470px] space-y-8 md:space-y-16">
            {loading && <div className="text-culosai-accent-gold text-xl">Generating...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {generatedImage ? (
              <div className="flex flex-col items-center gap-4">
                <img src={generatedImage} alt="Generated" className="rounded-xl max-w-full max-h-[400px]" />
                <div className="flex gap-4">
                  <a
                    href={generatedImage}
                    download="generated-image.png"
                    className="bg-culosai-accent-gold text-culosai-dark-brown px-6 py-2 rounded-lg font-norwester hover:bg-culosai-accent-gold/80 transition-colors"
                  >
                    Download
                  </a>
                  <button
                    onClick={handleClear}
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg font-norwester hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-2xl">
                <p className="text-culosai-cream text-lg md:text-xl lg:text-2xl leading-relaxed">
                  Select from the options below and press "
                  <span className="text-culosai-rust">AI Generate</span>
                  ". The AI generated image will appear here.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <ChevronDown
                className="text-culosai-cream w-6 h-6"
                strokeWidth={1.5}
              />
              <span className="text-culosai-cream text-sm font-norwester">
                Scroll
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="bg-[#171717] rounded-3xl p-6 md:p-8 mb-6 md:mb-8">
          <div className="space-y-6">
            {/* Advanced Header */}
            <button
              onClick={() => setAdvancedExpanded(!advancedExpanded)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-culosai-cream text-base md:text-lg font-norwester">
                Advanced
              </h3>
              <ChevronUp
                className="text-culosai-cream w-6 h-6"
                strokeWidth={2}
              />
            </button>

            {/* Advanced Content */}
            {advancedExpanded && (
              <div className="bg-[#2A2A2A] rounded-xl p-3 md:p-4">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-transparent text-culosai-cream text-sm md:text-base font-norwester placeholder-gray-500 border-none outline-none resize-none min-h-[80px]"
                  placeholder="Enter what you want to see.&#10;Example:&#10;A beautiful landscape with mountains and sunset."
                />
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-600/30"></div>

            {/* Aspect Ratio */}
            <button
              onClick={() => setAspectRatioExpanded(!aspectRatioExpanded)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-culosai-cream text-base md:text-lg font-norwester">
                Aspect Ratio
              </h3>
              <ChevronUp
                className="text-culosai-cream w-6 h-6"
                strokeWidth={2}
              />
            </button>

            {aspectRatioExpanded && (
              <div className="flex flex-wrap gap-4">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedAspectRatio(ratio.id)}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-norwester transition-colors ${
                      selectedAspectRatio === ratio.id
                        ? "bg-culosai-dark-brown/35 text-culosai-accent-gold"
                        : "bg-gray-600/30 text-gray-400 hover:bg-gray-600/50"
                    }`}
                  >
                    {ratio.ratio}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-[#171717] rounded-3xl p-6 md:p-8 mb-8 md:mb-12">
          <div className="space-y-6">
            {/* Category Header */}
            <button
              onClick={() => setCategoryExpanded(!categoryExpanded)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="text-culosai-cream text-base md:text-lg font-norwester">
                Category 1 (single select)
              </h3>
              <ChevronUp
                className="text-culosai-cream w-6 h-6"
                strokeWidth={2}
              />
            </button>

            {/* Category Grid */}
            {categoryExpanded && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCategory(option.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-norwester transition-colors ${
                      selectedCategory === option.id
                        ? "bg-culosai-dark-brown/35 text-culosai-accent-gold"
                        : "bg-gray-600/30 text-gray-400 hover:bg-gray-600/50"
                    }`}
                  >
                    <span>{option.label}</span>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-px h-4 ${
                          selectedCategory === option.id
                            ? "bg-culosai-accent-gold"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <HelpCircle
                        className={`w-3 h-3 ${
                          selectedCategory === option.id
                            ? "text-culosai-accent-gold"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            className="bg-culosai-light-cream text-culosai-brown px-8 md:px-12 py-3 md:py-4 rounded-[25px] text-xl md:text-2xl font-norwester hover:bg-culosai-cream transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Generating..." : "AI Generate"}
          </button>
        </div>
      </main>
    </div>
  );
}
