// Route configuration for admin dashboard
export const adminRoutes = [
  {
    path: "/dashboard",
    title: "Dashboard",
    description: "Overview and analytics",
  },
  {
    path: "/dashboard/properties",
    title: "Properties",
    description: "Manage property listings",
  },
  {
    path: "/dashboard/users",
    title: "Users",
    description: "User management",
  },
  {
    path: "/dashboard/destinations/category",
    title: "Categories",
    description: "Destination categories",
  },
  {
    path: "/dashboard/destinations/packages",
    title: "Packages",
    description: "Travel packages",
  },
  {
    path: "/dashboard/destinations/coupons",
    title: "Coupons",
    description: "Discount coupons",
  },
  {
    path: "/dashboard/destinations/transactions",
    title: "Transactions",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/events",
    title: "Events Calender",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/destinations/packages/create",
    title: "Add Package",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/bookings",
    title: "Manage Bookings ",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/payments",
    title: "Refund Management ",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/hotels",
    title: "Hotels",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/reviews",
    title: "Reviews",
    description: "Payment transactions",
  },
  {
    path: "/dashboard/notifications",
    title: "Notifications",
    description: "Payment transactions",
  },
];

// Helper function to get route details by path
export const getRouteByPath = (pathname) => {
  return (
    adminRoutes.find((route) => route.path === pathname) || {
      path: pathname,
      title: "Admin",
      description: "Administration panel",
    }
  );
};

// Helper function to get title by path
export const getTitleByPath = (pathname) => {
  const route = getRouteByPath(pathname);
  return route.title;
};
