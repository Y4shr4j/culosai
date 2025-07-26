import React, { useState, useEffect } from "react";
import { User, ChevronLeft, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  image: string;
}

const tokenPackages: TokenPackage[] = [
  {
    id: "20-tokens",
    tokens: 20,
    price: 9.99,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e09c95510744d73cfc34946b0c0d258ff0f301bd?width=200",
  },
  {
    id: "50-tokens",
    tokens: 50,
    price: 24.99,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f62e9b0760abc723b722adfef447297f3c3c46a0?width=200",
  },
  {
    id: "100-tokens",
    tokens: 100,
    price: 49.99,
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/596554b5957d7af1cbe3bfc77e88d995b06ba5d8?width=200",
  },
];

const Index: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    "paypal" | "crypto" | null
  >(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState<number | null>(null);

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

  const handleTokenPurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-culosai-cream border border-culosai-brown rounded-[20px] md:rounded-[40px] p-4 md:p-8 w-full max-w-sm md:max-w-2xl">
        <div className="flex flex-col items-center gap-8 md:gap-16">
          {/* Header */}
          <div className="flex flex-col items-start gap-4 md:gap-8 w-full">
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-culosai-brown hover:text-culosai-dark-brown transition-colors"
                >
                  <ChevronLeft
                    size={20}
                    strokeWidth={3}
                    className="md:w-6 md:h-6"
                  />
                </button>
                <h2 className="font-norwester text-lg md:text-xl text-culosai-brown text-center flex-1">
                  Cambio de Paquete
                </h2>
              </div>
              <p className="font-norwester text-sm md:text-base text-culosai-rust">
                Seleccionar metodo de pago
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 w-full">
              <button
                onClick={() => setSelectedPayment("paypal")}
                className={`flex flex-col items-center justify-center w-full sm:w-[200px] md:w-[228px] h-[120px] md:h-[140px] rounded-xl border-2 transition-all ${
                  selectedPayment === "paypal"
                    ? "border-culosai-dark-brown bg-culosai-selected"
                    : "border-culosai-dark-brown/50 bg-culosai-light-cream hover:border-culosai-dark-brown"
                }`}
              >
                <svg
                  width="121"
                  height="34"
                  viewBox="0 0 121 34"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M14.5033 0.501953H5.10273C4.45933 0.501953 3.9123 0.980941 3.81192 1.63183L0.00987164 26.331C-0.0657482 26.8182 0.302717 27.2578 0.785116 27.2578H5.27312C5.91641 27.2578 6.46344 26.779 6.56381 26.1268L7.58923 19.4651C7.68824 18.8129 8.23663 18.334 8.87856 18.334H11.8545C18.047 18.334 21.6208 15.2637 22.5543 9.17933C22.9748 6.51739 22.572 4.42597 21.3555 2.96123C20.0195 1.35267 17.6497 0.501953 14.5033 0.501953ZM15.5879 9.52303C15.0738 12.9793 12.4965 12.9793 10.0044 12.9793H8.58583L9.58099 6.52454C9.64014 6.13437 9.96997 5.84706 10.3549 5.84706H11.005C12.7026 5.84706 14.3041 5.84706 15.1315 6.83848C15.625 7.4301 15.7762 8.30891 15.5879 9.52303Z"
                    fill="#283B82"
                  />
                  <path
                    d="M42.6043 9.41179H38.1029C37.7193 9.41179 37.3881 9.69912 37.3288 10.0893L37.1297 11.3794L36.8148 10.9117C35.8404 9.46242 33.667 8.97803 31.498 8.97803C26.5234 8.97803 22.2746 12.8385 21.4471 18.2538C21.017 20.9551 21.6286 23.5381 23.1242 25.3394C24.4959 26.9956 26.4587 27.6858 28.7944 27.6858C32.8026 27.6858 35.0251 25.0451 35.0251 25.0451L34.8245 26.3269C34.7487 26.817 35.1173 27.2564 35.597 27.2564H39.6517C40.2965 27.2564 40.8409 26.7774 40.9427 26.1254L43.3755 10.3385C43.4526 9.85257 43.0856 9.41179 42.6043 9.41179ZM36.3295 18.389C35.8954 21.0241 33.854 22.7932 31.2506 22.7932C29.9436 22.7932 28.8986 22.3635 28.2279 21.5494C27.5627 20.741 27.3097 19.5904 27.5213 18.3087C27.9268 15.6961 30.0026 13.8695 32.566 13.8695C33.8444 13.8695 34.8835 14.3046 35.5682 15.1256C36.2541 15.9552 36.5261 17.1129 36.3295 18.389Z"
                    fill="#283B82"
                  />
                  <path
                    d="M66.5792 9.41187H62.0557C61.624 9.41187 61.2185 9.63159 60.9738 9.99927L54.7346 19.4159L52.0901 10.3668C51.9237 9.80055 51.4139 9.41187 50.8365 9.41187H46.3912C45.8509 9.41187 45.4758 9.95265 45.6476 10.4738L50.6302 25.4564L45.9459 32.2324C45.5773 32.7661 45.9484 33.5001 46.5851 33.5001H51.1033C51.532 33.5001 51.9335 33.2858 52.1766 32.9254L67.2227 10.6725C67.5828 10.14 67.2131 9.41187 66.5792 9.41187Z"
                    fill="#283B82"
                  />
                  <path
                    d="M81.556 0.501953H72.154C71.5121 0.501953 70.965 0.980941 70.8646 1.63183L67.0626 26.331C66.987 26.8182 67.3554 27.2578 67.8351 27.2578H72.6599C73.1079 27.2578 73.4917 26.9227 73.5615 26.4662L74.6404 19.4651C74.7395 18.8129 75.2881 18.334 75.9298 18.334H78.9045C85.0983 18.334 88.6708 15.2637 89.6055 9.17933C90.0276 6.51739 89.6221 4.42597 88.4056 2.96123C87.0708 1.35267 84.7024 0.501953 81.556 0.501953ZM82.6407 9.52303C82.1279 12.9793 79.5507 12.9793 77.0571 12.9793H75.64L76.6366 6.52454C76.6956 6.13437 77.0226 5.84706 77.4089 5.84706H78.0591C79.7555 5.84706 81.358 5.84706 82.1856 6.83848C82.679 7.4301 82.8288 8.30891 82.6407 9.52303Z"
                    fill="#469BDB"
                  />
                  <path
                    d="M109.655 9.41179H105.156C104.77 9.41179 104.441 9.69912 104.384 10.0893L104.184 11.3794L103.868 10.9117C102.894 9.46242 100.722 8.97803 98.5529 8.97803C93.5782 8.97803 89.3309 12.8385 88.5034 18.2538C88.0746 20.9551 88.6834 23.5381 90.179 25.3394C91.5537 26.9956 93.5136 27.6858 95.849 27.6858C99.8573 27.6858 102.08 25.0451 102.08 25.0451L101.879 26.3269C101.804 26.817 102.172 27.2564 102.655 27.2564H106.708C107.35 27.2564 107.897 26.7774 107.998 26.1254L110.432 10.3385C110.506 9.85257 110.138 9.41179 109.655 9.41179ZM103.38 18.389C102.949 21.0241 100.905 22.7932 98.3015 22.7932C96.9969 22.7932 95.9495 22.3635 95.2785 21.5494C94.6135 20.741 94.3631 19.5904 94.5722 18.3087C94.9804 15.6961 97.0532 13.8695 99.6168 13.8695C100.895 13.8695 101.934 14.3046 102.619 15.1256C103.307 15.9552 103.58 17.1129 103.38 18.389Z"
                    fill="#469BDB"
                  />
                  <path
                    d="M114.962 1.17954L111.104 26.331C111.028 26.8182 111.396 27.2577 111.876 27.2577H115.755C116.4 27.2577 116.947 26.779 117.046 26.1268L120.851 1.42902C120.926 0.941516 120.558 0.500732 120.078 0.500732H115.734C115.351 0.501907 115.021 0.789592 114.962 1.17954Z"
                    fill="#469BDB"
                  />
                </svg>
              </button>

              <button
                onClick={() => setSelectedPayment("crypto")}
                className={`flex flex-col items-center justify-center w-full sm:w-[200px] md:w-[228px] h-[120px] md:h-[140px] rounded-xl border transition-all ${
                  selectedPayment === "crypto"
                    ? "border-culosai-dark-brown bg-culosai-selected border-2"
                    : "border-culosai-dark-brown/50 bg-culosai-light-cream hover:border-culosai-dark-brown"
                }`}
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/39faec1ba29b02ea401235473c601b3758a75872?width=274"
                  alt="Crypto accepted"
                  className="w-[100px] h-[65px] md:w-[137px] md:h-[89px] rounded-[14px]"
                />
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            className="bg-culosai-dark-brown hover:bg-culosai-dark-brown/90 text-culosai-cream font-norwester text-xl md:text-2xl px-8 md:px-[70px] py-3 md:py-[14px] rounded-[10px] border border-black transition-all w-full sm:w-auto"
            onClick={() => {
              // Handle payment processing
              setShowPaymentModal(false);
              setSelectedPayment(null);
              setSelectedPackage(null);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2A2A2A] via-[#2A2A2A] to-[#513238] font-norwester">
      {/* Navbar */}
      <Navbar user={user} tokens={tokens} onLogout={handleLogout} />
      {/* Header Navigation (old header removed) */}
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="xl:hidden bg-culosai-card-dark border-t border-culosai-dark-brown">
          <nav className="flex flex-col gap-4 px-4 py-6 max-w-[1200px] mx-auto">
            <Link
              to="/dashboard"
              onClick={() => setShowMobileMenu(false)}
              className="text-culosai-gold font-norwester text-xl font-normal hover:text-culosai-accent-gold transition-colors py-2"
            >
              Dashboard
            </Link>
            <Link
              to="/ai-images"
              onClick={() => setShowMobileMenu(false)}
              className="text-culosai-gold font-norwester text-xl font-normal hover:text-culosai-accent-gold transition-colors py-2"
            >
              AI Images
            </Link>
            <a
              href="#"
              onClick={() => setShowMobileMenu(false)}
              className="text-culosai-gold font-norwester text-xl font-normal hover:text-culosai-accent-gold transition-colors py-2"
            >
              AI Videos
            </a>
            <a
              href="#"
              onClick={() => setShowMobileMenu(false)}
              className="text-culosai-gold font-norwester text-xl font-normal hover:text-culosai-accent-gold transition-colors py-2"
            >
              AI Character
            </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-col items-center gap-6 md:gap-8 px-4 py-8 md:py-12 max-w-[857px] mx-auto">
        {/* Title */}
        <h2 className="font-norwester text-2xl md:text-3xl lg:text-[40px] font-normal text-center leading-normal px-4">
          <span className="text-culosai-cream">Need some </span>
          <span className="text-culosai-rust">Milk</span>
          <span className="text-culosai-cream">? Get more</span>
        </h2>

        {/* Token Cards */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-10 w-full">
          {tokenPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handleTokenPurchase(pkg.id)}
              className="group flex flex-col items-center justify-center w-full max-w-[280px] sm:max-w-[240px] lg:w-[259px] p-4 px-[20px] md:px-[30px] py-4 gap-[10px] rounded-xl border border-white/20 token-card-gradient shadow-[0px_6px_12px_0px_rgba(0,0,0,0.25)] hover:shadow-[0px_8px_16px_0px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-105"
            >
              {/* Price */}
              <div className="w-full text-right text-culosai-accent-gold font-norwester text-lg md:text-xl font-normal">
                ${pkg.price}
              </div>

              {/* Content */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={pkg.image}
                  alt={`${pkg.tokens} tokens`}
                  className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-contain"
                />

                <div className="flex flex-col items-center">
                  <div className="text-culosai-cream font-norwester text-3xl md:text-[40px] font-normal text-center leading-normal">
                    {pkg.tokens}
                  </div>
                  <div className="text-culosai-cream font-norwester text-xl md:text-2xl font-normal text-center leading-normal">
                    tokens
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default Index;
