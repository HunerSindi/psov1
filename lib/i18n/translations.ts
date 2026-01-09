// translations.ts
import { addItemTranslations } from "./add_item_translations";
import { analyticTranslations } from "./analytic_translations";
import { analyticsGeneralTranslations } from "./analytics_general_translations";
import { backupTranslations } from "./backup_translations";
import { companyReturnTranslations } from "./company_return_translations";
import { companyTranslations } from "./company_translations";
import { customerTranslations } from "./customer_translations";
import { damagedItemsTranslations } from "./damaged_items_translations";
import { dashboardTranslations } from "./dashboard_translations";
import { defineItemTranslations } from "./define_item_translations";
import { developerTranslations } from "./developer_translations";
import { expenseCategoryTranslations } from "./expense_category_translations";
import { expenseTranslations } from "./expense_translations";
import { inventoryTranslations } from "./inventory_translations";
import { kgHelperTranslations } from "./kg_helper_translations";
import { lengthHelperTranslations } from "./length_helper_translations";
import { packetHelperTranslations } from "./packet_helper_translations";
import { permissionsTranslations } from "./permissions_translations";
import { returnHistoryTranslations } from "./return_history_translations";
import { returnsTranslations } from "./returns_translations";
import { saleTicketTranslations } from "./sale_ticket_translation";
import { salesHistoryTranslations } from "./sales_history_translations";
import { usersTranslations } from "./users_translations";

export type Language = "en" | "ar" | "ku";

export const translations = {
  en: {
    title: "Point of Sale",
    dashboard: "Dashboard",
    settings: "Settings",
    save: "Save Changes",
    upload: "Upload Image",
    remove: "Remove",
    general: "General Settings",
    printing: "Printing Preferences",
    assets: "Receipt Assets",
    app_lang: "Application Language",
    print_a4_lang: "A4 Invoice Language",
    print_pos_lang: "POS Receipt Language",
    header_a4: "A4 Header Image",
    footer_a4: "A4 Footer Image",
    header_pos: "POS Header Image",
    success: "Settings saved successfully!",
    printer_connection: "Printer Connection",
    printer_ip: "Printer IP Address",
    printer_ip_help:
      "Enter the Local IP address of your ESC/POS Thermal Printer.",

    connection_type: "Connection Type",
    printer_name: "USB Printer Name",
    printer_name_help:
      "Enter the exact name of the printer as found in Windows Control Panel/Settings.",
    // Imported Section
    define_item: defineItemTranslations.en,
    kg_helper: kgHelperTranslations.en,
    length_helper: lengthHelperTranslations.en,
    packet_helper: packetHelperTranslations.en,
    dashboard_menu: dashboardTranslations.en,
    add_item: addItemTranslations.en,
    sale_ticket: saleTicketTranslations.en,
    sales_history: salesHistoryTranslations.en,
    users: usersTranslations.en,
    analytics: analyticTranslations.en,
    company: companyTranslations.en,
    customer: customerTranslations.en,
    expense_category: expenseCategoryTranslations.en,
    expense: expenseTranslations.en,
    inventory: inventoryTranslations.en,
    returns: returnsTranslations.en,
    return_history: returnHistoryTranslations.en,
    developer: developerTranslations.en,
    backup: backupTranslations.en,
    analytics_general: analyticsGeneralTranslations.en,
    permissions: permissionsTranslations.en,
    damaged_items: damagedItemsTranslations.en,
    company_return: companyReturnTranslations.en,
  },
  ar: {
    title: "نقطة البيع",
    dashboard: "لوحة القيادة",
    settings: "الإعدادات",
    save: "حفظ التغييرات",
    upload: "رفع صورة",
    remove: "حذف",
    general: "الإعدادات العامة",
    printing: "تفضيلات الطباعة",
    assets: "أصول الفواتير",
    app_lang: "لغة التطبيق",
    print_a4_lang: "لغة فاتورة A4",
    print_pos_lang: "لغة وصل الكاشير",
    header_a4: "ترويسة A4",
    footer_a4: "تذييل A4",
    header_pos: "ترويسة الكاشير",
    success: "تم حفظ الإعدادات بنجاح!",
    printer_connection: "اتصال الطابعة",
    printer_ip: "عنوان IP للطابعة",
    printer_ip_help: "أدخل عنوان IP المحلي لطابعة الإيصالات الحرارية.",
    connection_type: "نوع الاتصال",
    printer_name: "اسم طابعة USB",
    printer_name_help:
      "أدخل الاسم الدقيق للطابعة كما هو موجود في إعدادات ويندوز.",
    // Imported Section
    define_item: defineItemTranslations.ar,
    kg_helper: kgHelperTranslations.ar,
    length_helper: lengthHelperTranslations.ar,
    packet_helper: packetHelperTranslations.ar,
    dashboard_menu: dashboardTranslations.ar,
    add_item: addItemTranslations.ar,
    sale_ticket: saleTicketTranslations.ar,
    sales_history: salesHistoryTranslations.ar,
    users: usersTranslations.ar,
    analytics: analyticTranslations.ar,
    company: companyTranslations.ar,
    customer: customerTranslations.ar,
    expense_category: expenseCategoryTranslations.ar,
    expense: expenseTranslations.ar,
    inventory: inventoryTranslations.ar,
    returns: returnsTranslations.ar,
    return_history: returnHistoryTranslations.ar,
    developer: developerTranslations.ar,
    backup: backupTranslations.ar,
    analytics_general: analyticsGeneralTranslations.ar,
    permissions: permissionsTranslations.ar,
    damaged_items: damagedItemsTranslations.ar,
    company_return: companyReturnTranslations.ar,
  },
  ku: {
    title: "خاڵی فرۆشتن",
    dashboard: "داشبۆرد",
    settings: "ڕێکخستنەکان",
    save: "پاشەکەوتکردن",
    upload: "وێنە باربکە",
    remove: "سڕینەوە",
    general: "ڕێکخستنە گشتییەکان",
    printing: "هەڵبژاردنی چاپ",
    assets: "پێداویستی وەسڵ",
    app_lang: "زمانی بەرنامە",
    print_a4_lang: "زمانی پسووڵەی A4",
    print_pos_lang: "زمانی وەسڵی کاشێر",
    header_a4: "هێدەری A4",
    footer_a4: "فوتەری A4",
    header_pos: "هێدەری کاشێر",
    success: "ڕێکخستنەکان پاشەکەوت کران!",
    printer_connection: "بەستنەوەی پرینتەر",
    connection_type: "جۆری پەیوەندی",
    printer_ip: "ناونیشانی IP پرێنتەر",
    printer_ip_help: "ناونیشانی IP لۆکاڵی پرێنتەری پسوولە بنووسە.",
    printer_name: "ناوی پرێنتەری USB",
    printer_name_help:
      "ناوی تەواوی پرێنتەرەکە بنووسە وەک ئەوەی لە ڕێکخستنەکانی ویندۆز هەیە.",
    // Imported Section
    define_item: defineItemTranslations.ku,
    kg_helper: kgHelperTranslations.ku,
    length_helper: lengthHelperTranslations.ku,
    packet_helper: packetHelperTranslations.ku,
    dashboard_menu: dashboardTranslations.ku,
    add_item: addItemTranslations.ku,
    sale_ticket: saleTicketTranslations.ku,
    sales_history: salesHistoryTranslations.ku,
    users: usersTranslations.ku,
    analytics: analyticTranslations.ku,
    company: companyTranslations.ku,
    customer: customerTranslations.ku,
    expense_category: expenseCategoryTranslations.ku,
    expense: expenseTranslations.ku,
    inventory: inventoryTranslations.ku,
    returns: returnsTranslations.ku,
    return_history: returnHistoryTranslations.ku,
    developer: developerTranslations.ku,
    backup: backupTranslations.ku,
    analytics_general: analyticsGeneralTranslations.ku,
    permissions: permissionsTranslations.ku,
    damaged_items: damagedItemsTranslations.ku,
    company_return: companyReturnTranslations.ku,
  },
};
