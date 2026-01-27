// config/menuItems.ts (or wherever this is located)

// 1. Update Interface
export interface MenuItem {
  transKey: string; // The key from dashboard_translations
  href: string;
  permission: string;
  isFinished: boolean;
  imageSrc: string;
}

// 2. Update Array with Keys
export const MENU_ITEMS: MenuItem[] = [
  {
    transKey: "new_item",
    href: "/define-item",
    permission: "define_item",
    isFinished: true,
    imageSrc: "/dashboard/new-tem.jpg.ico",
  },
  {
    transKey: "add_item",
    href: "/add-item",
    permission: "add_item",
    isFinished: true,
    imageSrc: "/dashboard/add-item.png",
  },
  {
    transKey: "sale_cart",
    href: "/sale-ticket",
    permission: "sale_ticket",
    isFinished: true,
    imageSrc: "/dashboard/pos.png",
  },
  {
    transKey: "sale_history",
    href: "/add-item/history",
    permission: "sale_history",
    isFinished: true,
    imageSrc: "/dashboard/history.png",
  },
  {
    transKey: "user_mgmt",
    href: "/users",
    permission: "users",
    isFinished: true,
    imageSrc: "/dashboard/user_mng.png",
  },
  {
    transKey: "inventory",
    href: "/inventory",
    permission: "inventory",
    isFinished: true,
    imageSrc: "/dashboard/inventory.png",
  },
  {
    transKey: "companies",
    href: "/company",
    permission: "companies",
    isFinished: true,
    imageSrc: "/dashboard/company.png",
  },
  {
    transKey: "company_return",
    href: "/company_returns",
    permission: "company_returns",
    isFinished: true,
    imageSrc: "/dashboard/product-return.png",
  },
  {
    transKey: "customers",
    href: "/customers",
    permission: "customers",
    isFinished: true,
    imageSrc: "/dashboard/rating.png",
  },
  {
    transKey: "categories",
    href: "/categories",
    permission: "categories",
    isFinished: true,
    imageSrc: "/dashboard/options.png",
  },
  {
    transKey: "expenses",
    href: "/expenses",
    permission: "expense",
    isFinished: true,
    imageSrc: "/dashboard/expenses.png",
  },
  {
    transKey: "returns",
    href: "/returns",
    permission: "return_item",
    isFinished: true,
    imageSrc: "/dashboard/return-box.png",
  },
  {
    transKey: "returns_history",
    href: "/returns/history",
    permission: "return_item_history",
    isFinished: true,
    imageSrc: "/dashboard/return-history.png",
  },
  {
    transKey: "damaged_item",
    href: "/damaged_items",
    permission: "damaged_items",
    isFinished: true,
    imageSrc: "/dashboard/damaged-package.png",
  },

  // {
  //     transKey: "due_installments",
  //     href: "/installments/warning",
  //     permission: "installments_warning",
  //     isFinished: false,
  //     imageSrc: "/dashboard/world.png"
  // },
  // {
  //     transKey: "all_installments",
  //     href: "/installments/list",
  //     permission: "installments_list",
  //     isFinished: false,
  //     imageSrc: "/dashboard/monthly-pay.png"
  // },
  {
    transKey: "reports_cashier",
    href: "/employee-analytic",
    permission: "cashier_report",
    isFinished: true,
    imageSrc: "/dashboard/report-cashier.png",
  },
  // {
  //     transKey: "reports_customers",
  //     href: "/reports-customers",
  //     permission: "reports-customer",
  //     isFinished: false,
  //     imageSrc: "/dashboard/history.png"
  // },
  // {
  //     transKey: "reports_companies",
  //     href: "/reports-companies",
  //     permission: "reports company",
  //     isFinished: false,
  //     imageSrc: "/dashboard/history.png"
  // },
  {
    transKey: "general_reports",
    href: "/general-report",
    permission: "general_report",
    isFinished: true,
    imageSrc: "/dashboard/analysis.png",
  },
  {
    transKey: "stock_valuation",
    href: "/stock-valuation",
    permission: "stock_valuation",
    isFinished: true,
    imageSrc: "/dashboard/stock.png",
  },
  // 
  {
    transKey: "backup",
    href: "/backup",
    permission: "backup",
    isFinished: true,
    imageSrc: "/dashboard/backup.png",
  },
  {
    transKey: "settings",
    href: "/settings",
    permission: "settings",
    isFinished: true,
    imageSrc: "/dashboard/settings.png",
  },
  {
    transKey: "about_us",
    href: "/developer",
    permission: "",
    isFinished: true,
    imageSrc: "/dashboard/info.png",
  },
];
