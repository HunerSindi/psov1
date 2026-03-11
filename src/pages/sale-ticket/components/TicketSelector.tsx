"use client";

export default function TicketSelector({ current, onSelect }: { current: number, onSelect: (n: number) => void }) {
    const tickets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return (
        <div className="flex flex-col gap-1 overflow-y-auto ">
            {tickets.map(num => (
                <button
                    key={num}
                    onClick={() => onSelect(num)}
                    className={`
                         py-3  font-bold text-lg  transition
                        ${current === num
                            ? "bg-black text-white  "
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                    `}
                >
                    {num}
                </button>
            ))}
        </div>
    );
}