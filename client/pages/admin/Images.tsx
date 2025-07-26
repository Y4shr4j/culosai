import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Edit, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { api } from "../../src/utils/api";

const ageTags = [
  { id: 1, label: "18+", category: "Adults" },
  { id: 2, label: "20+", category: "Young Adults" },
  { id: 3, label: "30+", category: "Adults" },
  { id: 4, label: "40+", category: "Middle-aged" },
  { id: 5, label: "50+", category: "Mature" },
  { id: 6, label: "60+", category: "Senior" },
];

export default function Images() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isBlurred, setIsBlurred] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/images");
      setImages(res.data.images || []);
    } catch (err: any) {
      setError("Failed to fetch images");
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("isBlurred", String(isBlurred));
      await api.post("/api/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setTitle("");
      setIsBlurred(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchImages();
    } catch (err: any) {
      setError("Failed to upload image");
    }
    setLoading(false);
  };

  // (Blur toggle and delete logic will be added next)

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
                Images
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

          {/* Image Upload Form */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] p-6 mb-8">
            <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold mb-4">
              Upload New Image
            </h2>
            <form className="flex flex-col md:flex-row items-center gap-4" onSubmit={handleUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="border rounded px-2 py-1"
                required
              />
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isBlurred}
                  onChange={e => setIsBlurred(e.target.checked)}
                />
                Blur this image?
              </label>
              <button
                type="submit"
                className="bg-[#036BF2] text-white px-4 py-2 rounded-md font-medium hover:bg-[#0256d1] transition-colors"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>

          {/* Uploaded Images List */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] p-6 mb-8">
            <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold mb-4">
              Uploaded Images
            </h2>
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : images.length === 0 ? (
              <div className="text-gray-500">No images uploaded yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img: any) => (
                  <div key={img.id || img._id} className="border rounded-lg p-2 flex flex-col items-center">
                    <div className="w-32 h-32 mb-2 overflow-hidden rounded">
                      <img
                        src={img.url}
                        alt={img.title || "Image"}
                        className={img.isBlurred ? "blur-sm" : ""}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="font-medium mb-1">{img.title || "(No title)"}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={img.isBlurred}
                          readOnly
                        />
                        Blurred
                      </label>
                    </div>
                    {/* Blur toggle and delete will be added next */}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories & Items Section (existing) */}
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
