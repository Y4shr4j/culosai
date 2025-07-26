import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Copy, Languages, X } from "lucide-react";
import { get, post } from "../../src/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}

interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  username: string;
}

const Dashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [copyFeedback, setCopyFeedback] = useState("");
  const [filters, setFilters] = useState<FilterOption[]>([
    { id: "top", label: "Top", active: true },
    { id: "new", label: "New", active: false },
    { id: "all-style", label: "All Style", active: false },
    { id: "specific-style", label: "Specific Style", active: true },
  ]);

  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [isUserBoxOpen, setIsUserBoxOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await get('/api/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const data = await get<{ tokens: number }>('/api/auth/tokens');
        setTokens(data.tokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };
    fetchTokens();
  }, []);

  const handleLogout = async () => {
    try {
      await post('/api/auth/logout');
      setUser(null);
      setTokens(null);
      localStorage.removeItem('token');
      window.location.href = "/login";
    } catch (error) {
      console.error('Error logging out:', error);
      // Still redirect even if logout fails
      localStorage.removeItem('token');
      window.location.href = "/login";
    }
  };

  const characters: Character[] = [
    {
      id: "1",
      name: "Antonio",
      description: "Best friend forever",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/4b3b8be6723ae33de272509ba68872736ca72896?width=240",
      username: "Username",
    },
    {
      id: "2",
      name: "Poalo",
      description: "Gotic girl",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/9252c568f666f8bcb0fc01d2edfd52e6a414e4fb?width=240",
      username: "Username",
    },
    {
      id: "3",
      name: "Antonio",
      description: "WW2 Wife",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/66334eb73fe953bc13cf5d5210370130008bae3f?width=240",
      username: "Username",
    },
    {
      id: "4",
      name: "Luisa",
      description: "Cousin",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3541687975b1aa47c41b1a07e3ad590c45ea9b2f?width=240",
      username: "Username",
    },
  ];

  const handleFilterToggle = (filterId: string) => {
    setFilters(
      filters.map((filter) =>
        filter.id === filterId ? { ...filter, active: !filter.active } : filter,
      ),
    );
  };

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleCopyPrompts = async () => {
    const promptText =
      "Teemo juega al futbol con una pelota redonda. Mejor calidad, arte digital superdetallado.";
    try {
      await navigator.clipboard.writeText(promptText);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (err) {
      setCopyFeedback("Failed to copy");
      setTimeout(() => setCopyFeedback(""), 2000);
    }
  };

  const tagRows = [
    ["30+", "Looking at Viewer", "Flight Attendant"],
    ["Cheerleader", "Bedroom", "Rear view"],
    ["Smooth Body", "Full Body", "Rear view"],
  ];

  const similarImages = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/ac8b99854fa69d254d4905ace50eb9116f97e840?width=196",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/2600715ba0f5d2c34105eda96d8a0a154bc61aa1?width=198",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/048c2ee589095aeb762924749191569d7247c6d3?width=196",
  ];

  // Handler to toggle user info box
  const handleUserBoxToggle = () => {
    setIsUserBoxOpen((prev) => !prev);
  };

  // Handler to close user info box when clicking outside
  useEffect(() => {
    if (!isUserBoxOpen) return;
    const handleClick = (e: MouseEvent) => {
      const userBox = document.getElementById("user-info-box");
      const profileBtn = document.getElementById("profile-btn");
      if (
        userBox &&
        !userBox.contains(e.target as Node) &&
        profileBtn &&
        !profileBtn.contains(e.target as Node)
      ) {
        setIsUserBoxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isUserBoxOpen]);

  // Token packages (same as Index.tsx)
  const tokenPackages = [
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

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"paypal" | "crypto" | null>(null);

  const handleTokenPurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
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
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
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
                {/* Paypal SVG (copy from Index.tsx) */}
                <svg
                  width="121"
                  height="34"
                  viewBox="0 0 121 34"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path d="M14.5033 0.501953H5.10273C4.45933 0.501953 3.9123 0.980941 3.81192 1.63183L0.00987164 26.331C-0.0657482 26.8182 0.302717 27.2578 0.785116 27.2578H5.27312C5.91641 27.2578 6.46344 26.779 6.56381 26.1268L7.58923 19.4651C7.68824 18.8129 8.23663 18.334 8.87856 18.334H11.8545C18.047 18.334 21.6208 15.2637 22.5543 9.17933C22.9748 6.51739 22.572 4.42597 21.3555 2.96123C20.0195 1.35267 17.6497 0.501953 14.5033 0.501953ZM15.5879 9.52303C15.0738 12.9793 12.4965 12.9793 10.0044 12.9793H8.58583L9.58099 6.52454C9.64014 6.13437 9.96997 5.84706 10.3549 5.84706H11.005C12.7026 5.84706 14.3041 5.84706 15.1315 6.83848C15.625 7.4301 15.7762 8.30891 15.5879 9.52303Z" fill="#283B82" />
                  <path d="M14.5033 0.501953H5.10273C4.45933 0.501953 3.9123 0.980941 3.81192 1.63183L0.00987164 26.331C-0.0657482 26.8182 0.302717 27.2578 0.785116 27.2578H5.27312C5.91641 27.2578 6.46344 26.779 6.56381 26.1268L7.58923 19.4651C7.68824 18.8129 8.23663 18.334 8.87856 18.334H11.8545C18.047 18.334 21.6208 15.2637 22.5543 9.17933C22.9748 6.51739 22.572 4.42597 21.3555 2.96123C20.0195 1.35267 17.6497 0.501953 14.5033 0.501953ZM15.5879 9.52303C15.0738 12.9793 12.4965 12.9793 10.0044 12.9793H8.58583L9.58099 6.52454C9.64014 6.13437 9.96997 5.84706 10.3549 5.84706H11.005C12.7026 5.84706 14.3041 5.84706 15.1315 6.83848C15.625 7.4301 15.7762 8.30891 15.5879 9.52303Z" fill="#283B82" />
                  <path d="M14.5033 0.501953H5.10273C4.45933 0.501953 3.9123 0.980941 3.81192 1.63183L0.00987164 26.331C-0.0657482 26.8182 0.302717 27.2578 0.785116 27.2578H5.27312C5.91641 27.2578 6.46344 26.779 6.56381 26.1268L7.58923 19.4651C7.68824 18.8129 8.23663 18.334 8.87856 18.334H11.8545C18.047 18.334 21.6208 15.2637 22.5543 9.17933C22.9748 6.51739 22.572 4.42597 21.3555 2.96123C20.0195 1.35267 17.6497 0.501953 14.5033 0.501953ZM15.5879 9.52303C15.0738 12.9793 12.4965 12.9793 10.0044 12.9793H8.58583L9.58099 6.52454C9.64014 6.13437 9.96997 5.84706 10.3549 5.84706H11.005C12.7026 5.84706 14.3041 5.84706 15.1315 6.83848C15.625 7.4301 15.7762 8.30891 15.5879 9.52303Z" fill="#283B82" />
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
    <div className="min-h-screen bg-gradient-to-b from-[#2A2A2A] via-[#2A2A2A] to-[#513238] text-white">
      {/* Navbar */}
      <Navbar user={user} tokens={tokens} onLogout={handleLogout} />

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-culosai-dark-brown/90 backdrop-blur-sm">
          <nav className="flex flex-col space-y-4 px-4 py-6">
            <Link
              to="/allimagegeneration"
              className="text-culosai-accent-gold font-norwester text-xl"
            >
              AI Images
            </Link>
            <Link
              to="/allimagegeneration"
              className="text-culosai-accent-gold font-norwester text-xl"
            >
              AI Videos
            </Link>
            <Link
              to="/allimagegeneration"
              className="text-culosai-accent-gold font-norwester text-xl"
            >
              AI Character
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 md:px-10 py-8 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Feature Cards */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 mb-16">
            {/* Generate Images Card */}
            <Link to="/aiimagegeneration" className="group">
              <div className="flex flex-col items-center gap-3 p-6 md:p-8 bg-[#813521] rounded-[20px] hover:bg-[#913721] transition-colors w-full lg:w-auto">
                <h2 className="text-culosai-cream font-norwester text-2xl md:text-[32px] text-center">
                  Generate Images
                </h2>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-2 bg-culosai-accent-gold rounded-[25px]">
                    <span className="text-culosai-dark-brown font-norwester text-xl md:text-2xl">
                      generate
                    </span>
                  </div>
                  <svg
                    width="37"
                    height="31"
                    viewBox="0 0 37 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M36 27.1V23.797C36 23.124 35.7455 22.4759 35.2876 21.9827L30.7787 17.1259C29.2016 15.4271 26.6446 15.4271 25.0675 17.1259L24.4928 17.7449C23.4377 18.8814 21.6392 18.8814 20.5842 17.7449L15.971 12.7759C14.3939 11.0771 11.8369 11.0771 10.2598 12.7759L1.71237 21.9827C1.25447 22.4759 1 23.124 1 23.797V27.1C1 28.7016 2.20539 30 3.69231 30H33.3077C34.7946 30 36 28.7016 36 27.1Z"
                      fill="#F5EDD0"
                    />
                    <path
                      d="M1 27.1V3.9C1 2.29837 2.20539 1 3.69231 1H33.3077C34.7946 1 36 2.29837 36 3.9V27.1M1 27.1C1 28.7016 2.20539 30 3.69231 30H33.3077C34.7946 30 36 28.7016 36 27.1M1 27.1V23.797C1 23.124 1.25447 22.4759 1.71237 21.9827L10.2598 12.7759C11.8369 11.0771 14.3939 11.0771 15.971 12.7759M36 27.1V23.797C36 23.124 35.7455 22.4759 35.2876 21.9827L30.7787 17.1259C29.2016 15.4271 26.6446 15.4271 25.0675 17.1259L24.4928 17.7449C23.4377 18.8814 21.6392 18.8814 20.5842 17.7449L15.971 12.7759M15.971 12.7759L25.2308 22.75"
                      stroke="#F5EDD0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Generate Videos Card */}
            <Link to="/aivideogeneration" className="w-full lg:w-auto">
              <div className="flex flex-col items-center gap-3 p-6 md:p-8 bg-[#42100B] rounded-[20px] cursor-pointer hover:bg-opacity-90 transition-colors w-full lg:w-auto">
                <h2 className="text-culosai-cream font-norwester text-2xl md:text-[32px] text-center">
                  Generate Videos
                </h2>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-2 bg-culosai-accent-gold rounded-[25px]">
                    <span className="text-culosai-dark-brown font-norwester text-xl md:text-2xl">
                      generate
                    </span>
                  </div>
                  <svg
                    width="41"
                    height="27"
                    viewBox="0 0 41 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.8077 10.7222L37.005 1.98209C37.9257 1.10714 39.5 1.72682 39.5 2.96419V24.0358C39.5 25.2732 37.9257 25.8929 37.005 25.0179L27.8077 16.2778M5.88462 26H23.4231C25.8446 26 27.8077 24.1345 27.8077 21.8333V5.16667C27.8077 2.86548 25.8446 1 23.4231 1H5.88462C3.46306 1 1.5 2.86548 1.5 5.16667V21.8333C1.5 24.1345 3.46306 26 5.88462 26Z"
                      stroke="#F5EDD0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Characters Card */}
            <Link to="/allimagegeneration" className="w-full lg:w-auto">
              <div className="flex flex-col items-center gap-3 p-6 md:p-8 bg-[#463034] rounded-[20px] cursor-pointer hover:bg-opacity-90 transition-colors w-full lg:w-auto">
                <h2 className="text-culosai-cream font-norwester text-2xl md:text-[32px] text-center">
                  Generate Characters
                </h2>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-2 bg-culosai-accent-gold rounded-[25px]">
                    <span className="text-culosai-dark-brown font-norwester text-xl md:text-2xl">
                      generate
                    </span>
                  </div>
                  <svg
                    width="37"
                    height="29"
                    viewBox="0 0 37 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28.9971 0.400391C30.0842 0.399948 31.0694 0.418928 31.9346 0.516602C32.7995 0.614244 33.5511 0.791116 34.1689 1.10742C34.789 1.4249 35.273 1.8825 35.6006 2.53711C35.927 3.18961 36.0954 4.03212 36.0986 5.11523L36.0996 17.1211C36.0996 18.3318 36.0277 19.5273 35.5098 20.5117C34.9876 21.504 34.0216 22.2668 32.2725 22.6348C31.0474 22.8924 29.636 22.7808 28.4014 22.7803L23.4316 22.7764H17.5039C16.8532 23.0916 14.4584 24.5222 12.1689 25.8887C11.0149 26.5774 9.88943 27.2486 9.0332 27.749C8.60544 27.999 8.24396 28.2064 7.97949 28.3525C7.8475 28.4255 7.73852 28.484 7.65723 28.5244C7.61676 28.5445 7.58182 28.5615 7.55371 28.5732C7.53976 28.5791 7.526 28.5839 7.51367 28.5879C7.50291 28.5914 7.48675 28.5964 7.46973 28.5977C7.16496 28.6198 6.9492 28.5019 6.80957 28.3008C6.67574 28.1078 6.61608 27.8451 6.5918 27.5791C6.56731 27.3107 6.57774 27.025 6.59375 26.7764C6.61012 26.5222 6.63179 26.3163 6.63184 26.1885L6.63477 22.7783C5.22404 22.8348 4.15504 22.6585 3.3457 22.2949C2.514 21.9212 1.96198 21.3554 1.59863 20.6621C1.23666 19.9713 1.06329 19.1572 0.979492 18.2891C0.895737 17.421 0.900787 16.4898 0.901367 15.5645L0.900391 6.31738C0.899846 4.46738 1.13451 3.02731 1.99512 2.0293C2.85774 1.02901 4.32709 0.495885 6.73145 0.401367H6.73535L28.9971 0.400391ZM23.6436 1.83008C17.6421 1.83043 11.6341 1.7668 5.63574 1.8291C4.75099 1.96893 4.11801 2.22583 3.66406 2.56152C3.21026 2.8972 2.9292 3.31747 2.75586 3.79395C2.58193 4.27219 2.51609 4.80873 2.49414 5.37695C2.47212 5.94739 2.4944 6.53712 2.49414 7.13184L2.49512 16.3525L2.48242 17.0654C2.47605 17.3054 2.46923 17.5461 2.46973 17.7861C2.47074 18.2668 2.49931 18.7396 2.60547 19.1836V19.1846C2.80715 20.0272 3.22843 20.5346 3.74707 20.8467C4.26992 21.1613 4.89981 21.282 5.52441 21.335C5.83626 21.3614 6.1448 21.3712 6.43555 21.3799C6.72473 21.3886 6.99923 21.3962 7.23828 21.4209C7.47595 21.4454 7.68985 21.4879 7.85449 21.5693C8.02363 21.653 8.14652 21.7816 8.18457 21.9746C8.22478 22.1784 8.22757 22.4061 8.22168 22.627C8.21563 22.8532 8.2009 23.0662 8.20215 23.2617L8.20312 26.4814L13.2539 23.543C14.0787 23.0548 14.644 22.6776 15.0928 22.3838C15.5405 22.0907 15.8781 21.8772 16.2412 21.7266C16.9696 21.4244 17.7913 21.3777 19.8145 21.3779L25.4238 21.3799L29.0332 21.3828C30.0788 21.3829 30.943 21.3606 31.6523 21.2637C32.3618 21.1668 32.9079 20.9969 33.3223 20.707C34.1436 20.1324 34.4884 19.0576 34.4902 16.9922L34.4912 14.2236C34.4923 11.2292 34.5481 8.23089 34.4844 5.24121C34.4661 4.37965 34.3456 3.74088 34.127 3.2666C33.9098 2.79572 33.5936 2.48195 33.1729 2.27051C32.7486 2.05742 32.2135 1.94583 31.5576 1.88867C30.9021 1.83157 30.1345 1.83003 29.2471 1.83008H23.6436Z"
                      fill="#FFEBB6"
                      stroke="#FFEBB6"
                      strokeWidth="0.2"
                    />
                    <path
                      d="M9.6917 9.75541C12.0567 9.63316 12.2591 12.3867 10.0725 12.716C7.82817 12.8876 7.40079 10.151 9.6917 9.75541Z"
                      fill="#FFEBB6"
                    />
                    <path
                      d="M18.0414 9.75647C20.6581 9.71171 20.9154 12.1247 18.8349 12.7171C16.5304 12.9486 15.8856 10.6584 18.0414 9.75647Z"
                      fill="#FFEBB6"
                    />
                    <path
                      d="M27.1142 9.75491C29.2978 9.53694 29.7267 12.1856 27.5732 12.7155C25.1569 12.8646 24.8049 10.0267 27.1142 9.75491Z"
                      fill="#FFEBB6"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Content Filters and Character Showcase */}
          <div className="space-y-10">
            {/* Filter Buttons */}
            <div className="flex justify-center">
              <div className="flex items-center gap-4 flex-wrap">
                {filters.map((filter, index) => (
                  <React.Fragment key={filter.id}>
                    <button
                      onClick={() => handleFilterToggle(filter.id)}
                      className={`px-6 py-2 rounded-xl font-norwester text-lg transition-colors ${
                        filter.active
                          ? "bg-culosai-accent-gold text-culosai-dark-brown"
                          : "bg-[#BDD8CD] text-culosai-dark-brown hover:bg-culosai-accent-gold/80"
                      }`}
                    >
                      {filter.label}
                    </button>
                    {index === 1 && (
                      <div className="w-1 h-6 bg-culosai-cream"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Character Showcase */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex flex-col items-start gap-4"
                  >
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-24 h-32 md:w-[120px] md:h-[158px] rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleCharacterClick(character)}
                    />
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-culosai-accent-gold font-norwester text-lg md:text-xl">
                          {character.name}
                        </h3>
                        <p className="text-culosai-accent-gold font-norwester text-xs">
                          {character.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b7afd1efe815ab60d76dcb130a792122a7df15ee?width=32"
                          alt="User"
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-[#F8C679] font-norwester text-xs">
                          {character.username}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Token Purchasing Section */}
      <section className="bg-gradient-to-b from-[#552934] to-[#2A2A2A] px-4 md:px-[217px] py-8 md:py-16">
        <div className="flex flex-col items-center gap-8">
          {/* Title */}
          <h2 className="text-center font-norwester text-2xl md:text-[40px] leading-normal">
            <span className="text-culosai-cream">Need some </span>
            <span className="text-[#CD8246]">Milk</span>
            <span className="text-culosai-cream">? Get more</span>
          </h2>

          {/* Token Cards */}
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            {tokenPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleTokenPurchase(pkg.id)}
                className="flex flex-col justify-center items-center gap-3 w-full max-w-[259px] px-8 py-4 rounded-[20px] border border-[#6D6D6D]/20 bg-gradient-to-b from-[#4A262F] to-[#382E30] shadow-[0px_6px_12px_0px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform"
              >
                <div className="text-[#F8C679] font-norwester text-xl text-right w-full">
                  ${pkg.price}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={pkg.image}
                    alt={`${pkg.tokens} tokens`}
                    className="w-[100px] h-[100px]"
                  />
                  <div className="flex flex-col items-center">
                    <div className="text-culosai-cream font-norwester text-[40px] leading-normal text-center">
                      {pkg.tokens}
                    </div>
                    <div className="text-culosai-cream font-norwester text-2xl leading-normal text-center">
                      tokens
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Details Modal */}
      {isModalOpen && selectedCharacter && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171717] rounded-[20px] w-full max-w-4xl h-auto max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
            {/* Left side - Character Image */}
            <div className="w-full lg:w-[270px] h-64 lg:h-[521px] flex-shrink-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3647855dc42a41c822e0e00b4951d114a17f789?width=540"
                alt={selectedCharacter.name}
                className="w-full h-full object-cover rounded-t-[20px] lg:rounded-l-[20px] lg:rounded-tr-none"
              />
            </div>

            {/* Right side - Details */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col gap-4 relative">
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-culosai-cream hover:text-culosai-accent-gold transition-colors"
              >
                <X size={24} />
              </button>

              {/* User info and Remix button */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/99cb9226ac87604e4ec84a80f6e923abb0665d10?width=100"
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                    <span className="text-culosai-cream font-norwester text-xl">
                      Mina Seo
                    </span>
                  </div>
                  <button className="px-8 py-2 bg-[#813521] rounded-[25px] hover:bg-[#913521] transition-colors">
                    <span className="text-culosai-accent-gold font-norwester text-xl">
                      Remix
                    </span>
                  </button>
                </div>
                <div className="w-full h-px bg-[#6D6D6D]/20"></div>
              </div>

              {/* Prompts section */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-6">
                    <span className="text-culosai-cream font-norwester text-sm">
                      Prompts
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCopyPrompts}
                        className="flex items-center gap-1 text-culosai-accent-gold hover:opacity-80 transition-opacity"
                      >
                        <Copy size={16} />
                        <span className="font-norwester text-sm">
                          {copyFeedback || "Copiar prompts"}
                        </span>
                      </button>
                      <Languages
                        size={20}
                        className="text-culosai-accent-gold"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-[#2A2A2A] rounded-[10px]">
                    <p className="text-[#BCBCBC]/80 font-norwester text-xs leading-relaxed">
                      Teemo juega al futbol con una pelota redonda. Mejor
                      calidad, arte digital superdetallado.
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-2 max-w-[291px]">
                  {tagRows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex items-center gap-8 p-3 rounded-[10px] bg-[#813521]/20"
                    >
                      {row.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-[#F8C679] font-norwester text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Similar images */}
                <div className="flex flex-col gap-3">
                  <span className="text-culosai-cream font-norwester text-base">
                    Similar images
                  </span>
                  <div className="flex items-center gap-4">
                    {similarImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Similar ${index + 1}`}
                        className="w-[98px] h-[129px] rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default Dashboard;
