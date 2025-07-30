import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { api } from "../../src/utils/api";

interface TokenConfig {
  tokenPrice: number;
  unlockPrice: number;
  minPurchase: number;
  maxPurchase: number;
}

export default function TokenSettings() {
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    tokenPrice: 0.05,
    unlockPrice: 1,
    minPurchase: 20,
    maxPurchase: 1000,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load current token configuration
  useEffect(() => {
    loadTokenConfig();
  }, []);

  const loadTokenConfig = async () => {
    try {
      // This would fetch from backend - for now using default values
      // const response = await api.get('/api/admin/token-config');
      // setTokenConfig(response.data);
    } catch (error) {
      console.error('Error loading token config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // This would save to backend - for now just simulate
      // await api.post('/api/admin/token-config', tokenConfig);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Token configuration updated successfully!' });
    } catch (error) {
      console.error('Error updating token config:', error);
      setMessage({ type: 'error', text: 'Failed to update token configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TokenConfig, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTokenConfig(prev => ({
      ...prev,
      [field]: numValue
    }));
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

            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="tokenPrice"
                    className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                  >
                    Token Price (USD)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      id="tokenPrice"
                      value={tokenConfig.tokenPrice}
                      onChange={(e) => handleInputChange('tokenPrice', e.target.value)}
                      step="0.01"
                      min="0"
                      className="flex-1 h-[31px] px-3 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent"
                      placeholder="0.05"
                    />
                    <span className="text-[#666] font-['Public_Sans'] text-sm">
                      per token
                    </span>
                  </div>
                  <p className="mt-2 text-[#666] font-['Public_Sans'] text-xs">
                    Price per token in USD
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="unlockPrice"
                    className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                  >
                    Image Unlock Price (tokens)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      id="unlockPrice"
                      value={tokenConfig.unlockPrice}
                      onChange={(e) => handleInputChange('unlockPrice', e.target.value)}
                      step="1"
                      min="1"
                      className="flex-1 h-[31px] px-3 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent"
                      placeholder="1"
                    />
                    <span className="text-[#666] font-['Public_Sans'] text-sm">
                      tokens per image
                    </span>
                  </div>
                  <p className="mt-2 text-[#666] font-['Public_Sans'] text-xs">
                    Number of tokens required to unlock one image
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="minPurchase"
                    className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                  >
                    Minimum Purchase (tokens)
                  </label>
                  <input
                    type="number"
                    id="minPurchase"
                    value={tokenConfig.minPurchase}
                    onChange={(e) => handleInputChange('minPurchase', e.target.value)}
                    step="1"
                    min="1"
                    className="w-full h-[31px] px-3 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent"
                    placeholder="20"
                  />
                  <p className="mt-2 text-[#666] font-['Public_Sans'] text-xs">
                    Minimum tokens a user can purchase at once
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="maxPurchase"
                    className="block text-[#23272E] font-['Public_Sans'] text-sm font-medium mb-2"
                  >
                    Maximum Purchase (tokens)
                  </label>
                  <input
                    type="number"
                    id="maxPurchase"
                    value={tokenConfig.maxPurchase}
                    onChange={(e) => handleInputChange('maxPurchase', e.target.value)}
                    step="1"
                    min="1"
                    className="w-full h-[31px] px-3 border border-[#E5E8F1] rounded-md bg-white text-[#23272E] font-['Public_Sans'] text-sm focus:outline-none focus:ring-2 focus:ring-[#036BF2] focus:border-transparent"
                    placeholder="1000"
                  />
                  <p className="mt-2 text-[#666] font-['Public_Sans'] text-xs">
                    Maximum tokens a user can purchase at once
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#036BF2] text-white px-6 py-2 rounded-md font-['Public_Sans'] text-sm font-medium hover:bg-[#0256d1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>

          {/* Token Package Management */}
          <div className="bg-white rounded-lg border border-[#E5E8F1] p-6 mt-6">
            <h2 className="text-[#23272E] font-['Public_Sans'] text-lg font-semibold mb-6">
              Token Packages
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#E5E8F1] rounded-lg p-4">
                <h3 className="font-semibold text-[#23272E] mb-2">Basic Package</h3>
                <p className="text-2xl font-bold text-[#036BF2] mb-1">20 tokens</p>
                <p className="text-sm text-[#666] mb-3">$1.00</p>
                <p className="text-xs text-[#666]">Perfect for trying out the platform</p>
              </div>
              
              <div className="border border-[#E5E8F1] rounded-lg p-4">
                <h3 className="font-semibold text-[#23272E] mb-2">Popular Package</h3>
                <p className="text-2xl font-bold text-[#036BF2] mb-1">50 tokens</p>
                <p className="text-sm text-[#666] mb-3">$2.50</p>
                <p className="text-xs text-[#666]">Most popular choice</p>
              </div>
              
              <div className="border border-[#E5E8F1] rounded-lg p-4">
                <h3 className="font-semibold text-[#23272E] mb-2">Premium Package</h3>
                <p className="text-2xl font-bold text-[#036BF2] mb-1">100 tokens</p>
                <p className="text-sm text-[#666] mb-3">$5.00</p>
                <p className="text-xs text-[#666]">Best value for power users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
