import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Trash2 } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "Understanding AI in Modern Applications",
    createdAt: "2024-01-15",
    status: "Published",
  },
  {
    id: 2,
    title: "Building Scalable Backend Services",
    createdAt: "2024-01-14",
    status: "Draft",
  },
  {
    id: 3,
    title: "Frontend Performance Optimization",
    createdAt: "2024-01-13",
    status: "Published",
  },
  {
    id: 4,
    title: "Database Design Best Practices",
    createdAt: "2024-01-12",
    status: "Published",
  },
];

export default function Posts() {
  const handleDeletePost = (postId: number) => {
    console.log("Deleting post:", postId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-2 pt-2">
          <div className="h-[66px] border-b border-[#E5E8F1] mb-4">
            <div className="h-[62px] px-0 py-3 rounded-md shadow-[0px_2px_4px_0px_rgba(165,163,174,0.30)] flex items-center justify-between">
              <h1 className="text-[#23272E] font-['Public_Sans'] text-2xl font-bold leading-[22px]">
                Posts
              </h1>
              <button className="bg-[#036BF2] text-white px-4 py-2 rounded-md font-['Public_Sans'] text-sm font-medium hover:bg-[#0256d1] transition-colors">
                New post
              </button>
            </div>
          </div>

          {/* Generated Posts Table */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E8F1]">
              <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold">
                Generated Posts
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E8F1] bg-[#FAFAFA]">
                    <th className="text-left px-6 py-3 text-[#23272E] font-['Public_Sans'] text-sm font-semibold">
                      Title
                    </th>
                    <th className="text-left px-6 py-3 text-[#23272E] font-['Public_Sans'] text-sm font-semibold">
                      Created Date
                    </th>
                    <th className="text-left px-6 py-3 text-[#23272E] font-['Public_Sans'] text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-[#23272E] font-['Public_Sans'] text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-[#E5E8F1] hover:bg-[#FAFAFA]"
                    >
                      <td className="px-6 py-4 text-[#23272E] font-['Public_Sans'] text-sm">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 text-[#23272E] font-['Public_Sans'] text-sm">
                        {post.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[rgba(255,26,0,0.16)] hover:bg-[rgba(255,26,0,0.24)] transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
