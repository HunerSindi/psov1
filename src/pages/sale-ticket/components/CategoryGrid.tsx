export default function CategoryGrid() {
    return (
        <div className="grid grid-cols-3 gap-3">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-50 border rounded-lg flex items-center justify-center text-gray-400 font-bold hover:bg-gray-100 cursor-pointer shadow-sm">
                    Category {i + 1}
                </div>
            ))}
        </div>
    );
}