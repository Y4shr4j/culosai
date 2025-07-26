import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AiCharacters() {
  const [formData, setFormData] = useState({
    characterName: "",
    description: "",
    basePrompt: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating character:", formData);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-2 pt-2">
          <div className="h-[66px] border-b border-[#E5E8F1] mb-4">
            <div className="h-[62px] px-0 py-3 rounded-md shadow-[0px_2px_4px_0px_rgba(165,163,174,0.30)] flex items-center">
              <h1 className="text-[#23272E] font-['Public_Sans'] text-2xl font-bold leading-[22px]">
                AI Characters
              </h1>
            </div>
          </div>

          {/* Create Character Form */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] p-6">
            <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold mb-6">
              Create Character
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="characterName"
                  className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                >
                  Character Name
                </label>
                <input
                  type="text"
                  id="characterName"
                  name="characterName"
                  value={formData.characterName}
                  onChange={handleInputChange}
                  className="w-full h-[31px] px-3 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent"
                  placeholder="Enter character name"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent resize-none"
                  placeholder="Enter character description"
                />
              </div>

              <div>
                <label
                  htmlFor="basePrompt"
                  className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                >
                  Base Prompt
                </label>
                <textarea
                  id="basePrompt"
                  name="basePrompt"
                  value={formData.basePrompt}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent resize-none"
                  placeholder="Enter base prompt for the character"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#036BF2] text-white px-6 py-2 rounded-md font-['Public_Sans'] text-sm font-medium hover:bg-[#0256d1] transition-colors"
                >
                  Create Character
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
