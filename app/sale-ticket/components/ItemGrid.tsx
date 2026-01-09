// "use client";

// import { useEffect, useState } from "react";
// import { getItemsByCategory, Item } from "@/lib/api/inventory"; // You need this API function
// import { addItemToSale } from "@/lib/api/sale-ticket";
// import { ArrowLeft, ImageOff } from "lucide-react";

// interface Props {
//     categoryId: number;
//     categoryName: string;
//     saleId: number | undefined;
//     onBack: () => void; // Go back to categories
//     onRefresh: () => void; // Refresh cart after adding
// }

// export default function ItemGrid({ categoryId, categoryName, saleId, onBack, onRefresh }: Props) {
//     const [items, setItems] = useState<Item[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const loadItems = async () => {
//             setLoading(true);
//             // Assuming you implement this API to filter by category
//             // e.g. GET /items?category_id=123
//             const data = await getItemsByCategory(categoryId);
//             setItems(data);
//             setLoading(false);
//         };
//         loadItems();
//     }, [categoryId]);

//     const handleItemClick = async (item: Item) => {
//         if (!saleId) return;

//         // Default to 'single' unit for grid click, or show a mini-modal to choose unit
//         const success = await addItemToSale(saleId, item.barcodes[0], "single", 1);

//         if (success) {
//             onRefresh(); // Update cart totals
//         } else {
//             alert("Failed to add item (Out of stock?)");
//         }
//     };

//     return (
//         <div className="flex flex-col h-full">
//             {/* Header: Back Button & Category Name */}
//             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300">
//                 <button
//                     onClick={onBack}
//                     className="bg-gray-200 hover:bg-gray-300 p-1 rounded-sm border border-gray-400"
//                 >
//                     <ArrowLeft size={16} />
//                 </button>
//                 <h3 className="font-bold text-sm uppercase text-gray-700">{categoryName}</h3>
//             </div>

//             {/* Grid */}
//             <div className="flex-1 overflow-y-auto pr-1">
//                 {loading ? (
//                     <div className="text-center p-4 text-gray-500">Loading Items...</div>
//                 ) : items.length === 0 ? (
//                     <div className="text-center p-4 text-gray-400 italic">No items in this category.</div>
//                 ) : (
//                     <div className="grid grid-cols-3 gap-2">
//                         {items.map((item) => (
//                             <button
//                                 key={item.id}
//                                 onClick={() => handleItemClick(item)}
//                                 className="flex flex-col items-center bg-white border border-gray-300 hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all p-1 h-24 overflow-hidden relative shadow-sm"
//                             >
//                                 {/* Price Badge */}
//                                 <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold px-1">
//                                     {item.single_price.toLocaleString()}
//                                 </span>

//                                 {/* Image Placeholder */}
//                                 <div className="flex-1 w-full flex items-center justify-center bg-gray-100 mb-1">
//                                     <ImageOff size={16} className="text-gray-300" />
//                                 </div>

//                                 {/* Name */}
//                                 <span className="text-[10px] font-bold text-gray-800 leading-tight text-center line-clamp-2 w-full">
//                                     {item.name}
//                                 </span>
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
