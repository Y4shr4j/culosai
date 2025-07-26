import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  ChevronUp,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

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
];

function resizeImage(file: File, width: number, height: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob!], file.name, { type: file.type }));
        }, file.type);
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function AIVideoGeneration() {
  const [advancedExpanded, setAdvancedExpanded] = useState(true);
  const [aspectRatioExpanded, setAspectRatioExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("2:3");
  const [selectedCategory, setSelectedCategory] = useState("option1");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/tokens`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
      }
    };
    fetchTokens();
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setTokens(null);
    window.location.href = "/login";
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Always resize to 1024x576 for Stability video API
      const resizedFile = await resizeImage(file, 1024, 576);
      setSelectedImage(resizedFile);
      setImagePreview(URL.createObjectURL(resizedFile));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptText(e.target.value);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedVideo(null);
    try {
      let imageFile = selectedImage;
      // If no image is uploaded but prompt is provided, generate image first
      if (!imageFile && promptText) {
        // 1. Generate image from prompt
        const imgRes = await fetch(`${API_BASE_URL}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ prompt: promptText }),
        });
        const imgData = await imgRes.json();
        if (!imgRes.ok || !imgData.imageUrl) {
          setError(imgData.message || "Failed to generate image from prompt");
          setLoading(false);
          return;
        }
        // Convert base64 to File
        const res = await fetch(imgData.imageUrl);
        const blob = await res.blob();
        imageFile = new File([blob], "generated.png", { type: "image/png" });
        setImagePreview(imgData.imageUrl);
      }
      if (!imageFile) {
        setError("Please upload an image or enter a prompt.");
        setLoading(false);
        return;
      }
      // 2. Send image to /api/generate-video
      const formData = new FormData();
      formData.append("image", imageFile, imageFile.name);
      const response = await fetch(`${API_BASE_URL}/api/generate-video`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedVideo(data.videoUrl);
      } else {
        setError(data.message || "Failed to generate video");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setPromptText("");
    setGeneratedVideo(null);
    setError(null);
    setSelectedImage(null);
    setImagePreview(null);
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
            Generate Video
          </h1>
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col items-center mb-4">
          <label className="block mb-2 text-culosai-cream text-lg">Prompt (optional):</label>
          <input
            type="text"
            value={promptText}
            onChange={handlePromptChange}
            placeholder="Enter a prompt to generate an image"
            className="mb-4 px-4 py-2 rounded border border-culosai-accent-gold bg-[#171717] text-culosai-cream w-full max-w-md"
          />
        </div>

        {/* Image Upload Area */}
        <div className="flex flex-col items-center mb-8">
          <label className="block mb-2 text-culosai-cream text-lg">Or upload an image to animate:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl max-w-xs max-h-64 mb-4 border border-culosai-accent-gold"
            />
          )}
        </div>

        {/* Video Preview Area */}
        <div className="bg-[#171717] rounded-3xl p-8 md:p-12 lg:p-16 mb-8 md:mb-12">
          <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[470px] space-y-8 md:space-y-16">
            {loading && <div className="text-culosai-accent-gold text-xl">Generating...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {generatedVideo ? (
              <div className="flex flex-col items-center gap-4">
                <video controls className="rounded-xl max-w-full max-h-[400px]">
                  <source src={generatedVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="flex gap-4">
                  <a
                    href={generatedVideo}
                    download="generated-video.mp4"
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
                  Enter a prompt or upload an image and press "<span className="text-culosai-rust">AI Generate</span>". The AI generated video will appear here.
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
                  placeholder="Enter what you want to see in the video.\nExample:\nA cat playing piano in a jazz bar."
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
            disabled={loading || (!selectedImage && !promptText)}
          >
            {loading ? "Generating..." : "AI Generate"}
          </button>
        </div>
      </main>
    </div>
  );
}
