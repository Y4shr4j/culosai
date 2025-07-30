import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Settings,
  FileText,
  Sparkles,
  DollarSign,
  Activity,
  Circle,
  ChevronDown,
  ChevronRight,
  Image,
  Video,
  Users,
} from "lucide-react";

interface AdminSidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: "API Settings",
    href: "/admin/apisettings",
    icon: Settings,
  },
  {
    title: "Posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "AI Characters",
    href: "/admin/ai-characters",
    icon: Sparkles,
  },
  {
    title: "Token Settings",
    href: "/admin/token-settings",
    icon: DollarSign,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: Activity,
  },
];

const categoriesItems = [
  {
    title: "Images",
    href: "/admin/images",
    icon: Image,
  },
  {
    title: "Videos",
    href: "/admin/videos",
    icon: Video,
  },
  {
    title: "Characters",
    href: "/admin/characters",
    icon: Users,
  },
];

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();
  const isCategoriesActive = [
    "/admin/images",
    "/admin/videos",
    "/admin/characters"
  ].some((path) => location.pathname.startsWith(path));

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(isCategoriesActive);

  useEffect(() => {
    if (isCategoriesActive) setIsCategoriesOpen(true);
  }, [isCategoriesActive]);


  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[#E5E8F1]",
        className,
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2.5 px-[18px] py-5 border-b border-[#E5E8F1]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e927e8a68d748c47ce5f2e63aa8e8236361b9891?width=74"
          alt="Admin Panel Logo"
          className="w-[37px] h-[34px]"
        />
        <span className="flex-1 text-[#23272E] font-['Public_Sans'] text-[22px] font-bold leading-6">
          Admin Panel
        </span>
      </div>

      {/* Configuration Section */}
      <div className="px-[30px] py-[15px]">
        <span className="text-[#3A4352] font-['Public_Sans'] text-[11px] font-semibold leading-[14px] tracking-wider">
          CONFIGURATION
        </span>
      </div>

      {/* Navigation Items */}
      <div className="px-[14px] space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-[9px] rounded-md transition-colors",
                isActive
                  ? "bg-[rgba(74,151,253,0.22)] text-[#1A1A1A] font-semibold"
                  : "text-[#1A1A1A] hover:bg-gray-50",
              )}
            >
              <Icon
                className="w-[22px] h-[22px] stroke-[#1A1A1A]"
                strokeWidth={1.75}
              />
              <span className="flex-1 font-['Public_Sans'] text-[15px] leading-[22px]">
                {item.title}
              </span>
            </Link>
          );
        })}

        {/* Categories Section with Dropdown */}
        <div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-[9px] rounded-md transition-colors",
              isCategoriesActive
                ? "bg-[rgba(74,151,253,0.22)] text-[#1A1A1A] font-semibold"
                : "text-[#1A1A1A] hover:bg-gray-50",
            )}
          >
            <Circle
              className="w-[22px] h-[22px] stroke-[#1A1A1A]"
              strokeWidth={1.75}
            />
            <span className="flex-1 font-['Public_Sans'] text-[15px] leading-[22px] text-left">
              Categories
            </span>
            {isCategoriesOpen ? (
              <ChevronDown className="w-5 h-5 fill-[#0F172A]" />
            ) : (
              <ChevronRight className="w-5 h-5 fill-[#0F172A]" />
            )}
          </button>

          {/* Categories Submenu */}
          {isCategoriesOpen && (
            <div className="mt-1 ml-6 space-y-1">
              {categoriesItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-[9px] rounded-md transition-colors",
                      isActive
                        ? "bg-[rgba(74,151,253,0.22)] text-[#1A1A1A] font-semibold"
                        : "text-[#1A1A1A] hover:bg-gray-50",
                    )}
                  >
                    <Icon
                      className="w-[18px] h-[18px] stroke-[#1A1A1A]"
                      strokeWidth={1.75}
                    />
                    <span className="flex-1 font-['Public_Sans'] text-[14px] leading-[20px]">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
