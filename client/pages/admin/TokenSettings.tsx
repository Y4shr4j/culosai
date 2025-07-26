import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function TokenSettings() {
  const [tokenPrice, setTokenPrice] = useState("0.001");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating token price:", tokenPrice);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <div className="p-2 pt-2">
          <div className="h-[66px] border-b border-[#E5E8F1] mb-4">
            <div className="h-[62px] px-0 py-3 rounded-md shadow-[0px_2px_4px_0px_rgba(165,163,174,0.30)] flex items-center">
              <h1 className="text-[#23272E] font-['Public_Sans'] text-2xl font-bold leading-[22px]">
                Token Settings
              </h1>
            </div>
          </div>

          {/* Token Configuration Form */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] p-6">
            <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold mb-6">
              Token Configuration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="tokenPrice"
                  className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                >
                  Tokens price
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    id="tokenPrice"
                    value={tokenPrice}
                    onChange={(e) => setTokenPrice(e.target.value)}
                    step="0.001"
                    min="0"
                    className="flex-1 h-[31px] px-3 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent"
                    placeholder="0.001"
                  />
                  <button
                    type="submit"
                    className="bg-[#036BF2] text-white px-6 py-2 rounded-md font-['Public_Sans'] text-sm font-medium hover:bg-[#0256d1] transition-colors"
                  >
                    Change
                  </button>
                </div>
                <p className="mt-2 text-[#666] font-['Public_Sans'] text-xs">
                  Price per token in USD
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
