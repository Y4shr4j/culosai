import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Edit, Trash2 } from "lucide-react";

const ageTags = [
  { id: 1, label: "18+", category: "Adults" },
  { id: 2, label: "20+", category: "Young Adults" },
  { id: 3, label: "30+", category: "Adults" },
  { id: 4, label: "40+", category: "Middle-aged" },
  { id: 5, label: "50+", category: "Mature" },
  { id: 6, label: "60+", category: "Senior" },
];

export default function Characters() {
  const handleEditTag = (tagId: number) => {
    console.log("Editing tag:", tagId);
  };

  const handleDeleteTag = (tagId: number) => {
    console.log("Deleting tag:", tagId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-2 pt-2">
          <div className="h-[66px] border-b border-[#E5E8F1] mb-4">
            <div className="h-[62px] px-0 py-3 rounded-md shadow-[0px_2px_4px_0px_rgba(165,163,174,0.30)] flex items-center justify-between">
              <h1 className="text-[#23272E] font-['Public_Sans'] text-2xl font-bold leading-[22px]">
                Characters
              </h1>
              <div className="flex items-center gap-3">
                <button className="bg-[#036BF2] text-white px-4 py-2 rounded-md font-['Public_Sans'] text-sm font-medium hover:bg-[#0256d1] transition-colors">
                  New category
                </button>
                <button className="bg-[#036BF2] text-white px-4 py-2 rounded-md font-['Public_Sans'] text-sm font-medium hover:bg-[#0256d1] transition-colors">
                  New item
                </button>
              </div>
            </div>
          </div>

          {/* Categories & Items Section */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] p-6">
            <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold mb-6">
              Categories & Items
            </h2>

            <div className="space-y-4">
              {ageTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 bg-[rgba(226,235,250,0.56)] rounded-lg border border-[#E5E8F1]"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-white px-3 py-1 rounded-full text-[#23272E] font-['Public_Sans'] text-sm font-medium border border-[#E5E8F1]">
                      {tag.label}
                    </span>
                    <span className="text-[#23272E] font-['Public_Sans'] text-sm">
                      {tag.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTag(tag.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white border border-[#E5E8F1] hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-[#666]" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[rgba(255,26,0,0.16)] hover:bg-[rgba(255,26,0,0.24)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
