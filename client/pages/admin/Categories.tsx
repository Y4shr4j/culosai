import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function Categories() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-2 pt-2">
          <div className="h-[66px] border-b border-[#E5E8F1] mb-4">
            <div className="h-[62px] px-0 py-3 rounded-md shadow-[0px_2px_4px_0px_rgba(165,163,174,0.30)] flex items-center">
              <h1 className="text-[#23272E] font-['Public_Sans'] text-2xl font-bold leading-[22px]">
                Categories
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              Categories management coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
