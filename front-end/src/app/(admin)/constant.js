import {
  MdDashboard,
  MdLocationOn,
  MdExpandMore,
  MdExpandLess,
  MdEvent,
  MdEventNote,
  MdPayment,
  MdHotel,
  MdPeople,
  MdRocket,
  MdNotifications,
  MdStar,
  MdAdminPanelSettings,
  MdSettings,
  MdList,
  MdCategory,
  MdLocalOffer,
  MdReceipt,
  MdOutlineLocationOn,
  MdOutlinePayment,
} from "react-icons/md";
import { GrHomeOption } from "react-icons/gr";
import { TbCalendarPlus, TbStars } from "react-icons/tb";
import { LuCalendarDays, LuHotel, LuRocket } from "react-icons/lu";
import { FiSettings, FiUsers } from "react-icons/fi";
import { AiOutlineNotification } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";

export const SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: GrHomeOption,
    path: "/dashboard",
    hasSubItems: false,
  },
  {
    id: "manage-destinations",
    title: "Manage Destinations",
    icon: MdOutlineLocationOn,
    hasSubItems: true,
    isExpanded: true,
    subItems: [
      {
        id: "package-list",
        title: "Package List",
        path: "/dashboard/destinations/packages",
        isDisabled: false,
      },
      {
        id: "category",
        title: "Category",
        path: "/dashboard/destinations/category",
        isDisabled: false,
      },
      {
        id: "coupon-management",
        title: "Coupon Management",
        path: "/dashboard/destinations/coupons",
        isDisabled: false,
      },
      {
        id: "transactions",
        title: "Transactions",
        path: "/dashboard/destinations/transactions",
        isDisabled: false,
      },
    ],
  },
  {
    id: "event-calendar",
    title: "Event Calendar",
    icon: TbCalendarPlus,
    path: "/dashboard/events",
    hasSubItems: false,
  },
  {
    id: "manage-bookings",
    title: "Manage Bookings",
    icon: LuCalendarDays,
    path: "/dashboard/bookings",
    hasSubItems: false,
  },
  {
    id: "payment",
    title: "Payment",
    icon: MdOutlinePayment,
    path: "/dashboard/payments",
    hasSubItems: false,
  },
  {
    id: "hotels",
    title: "Hotels",
    icon: LuHotel,
    path: "/dashboard/hotels",
    hasSubItems: false,
  },
  {
    id: "user-management",
    title: "User Management",
    icon: FiUsers,
    path: "/dashboard/users",
    hasSubItems: false,
  },
  {
    id: "seo-tools",
    title: "SEO Tools",
    icon: LuRocket,
    hasSubItems: true,
    isExpanded: false,
    subItems: [
      {
        id: "seo-analytics",
        title: "SEO Analytics",
        path: "/dashboard/seo/analytics",
        isDisabled: false,
      },
      {
        id: "seo-optimization",
        title: "SEO Optimization",
        path: "/dashboard/seo/optimization",
        isDisabled: false,
      },
      {
        id: "seo-reports",
        title: "SEO Reports",
        path: "/dashboard/seo/reports",
        isDisabled: false,
      },
    ],
  },
  {
    id: "push-notification",
    title: "Push Notification",
    icon: AiOutlineNotification,
    path: "/dashboard/notifications",
    hasSubItems: false,
  },
  {
    id: "ratings-reviews",
    title: "Ratings & Reviews",
    icon: TbStars,
    path: "/dashboard/reviews",
    hasSubItems: false,
  },
];

export const ADMIN_SECTION_ITEMS = [
  {
    id: "admin-profile",
    title: "Admin",
    icon: FaRegUserCircle,
    path: "/dashboard/profile",
    hasSubItems: false,
  },
  {
    id: "settings",
    title: "Settings",
    icon: FiSettings,
    path: "/dashboard/settings",
    hasSubItems: false,
  },
];
