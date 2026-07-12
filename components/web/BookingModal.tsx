import { createPortal } from "react-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  if (!isOpen) return null;

  const timeSlots: string[] = ["7:30am", "8:00am", "2:00pm", "2:30pm", "6:30pm"];

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto flex flex-col md:flex-row md:items-center md:justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1c1c] text-white w-full min-h-[125vh] md:min-h-0 md:rounded-2xl shadow-2xl md:max-w-7xl px-4 md:px-6 md:py-16 relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-white text-lg"
        >
          ✕
        </button>

        {/* Left Info Section */}
        <div className="w-full md:w-1/3 md:pr-6 border-b md:border-b-0 md:border-r border-gray-700 pb-6 md:pb-0 mt-3">
          <h2 className="text-xl font-bold mb-2 text-center md:text-left">👋 Intro call w/ Huy</h2>
          <p className="text-sm text-gray-400 mb-4 text-center md:text-left">
            Booking projects for October
          </p>
          <p className="text-gray-300 text-sm leading-relaxed text-center md:text-left">
            Hey! Please book a date and time that works for you to go over your
            business needs.
          </p>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-300 items-center md:items-start">
            <span className="inline-block bg-[#2a2a2a] px-3 py-1 rounded-md font-medium">
              ⏱ 30 min
            </span>
            <span>📍 Google Meet</span>
            <span>🌍 Asia/Karachi</span>
          </div>
        </div>

        {/* Middle Calendar Section */}
        <div className="w-full md:w-1/3 md:px-2 py-6 md:py-0">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 hover:bg-[#2a2a2a] rounded-md">
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-semibold">August 2025</h3>
            <button className="p-1 hover:bg-[#2a2a2a] rounded-md">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Calendar Dates */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`py-3 px-3 text-center cursor-pointer rounded-md transition ${
                  selectedDate === day
                    ? "bg-white text-black font-bold"
                    : "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Right Time Slots */}
        <div className="w-full md:w-1/3 md:pl-6 border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0">
          <h3 className="font-semibold mb-3 text-center md:text-left">
            {selectedDate ? `${selectedDate} August 2025` : "Select a date"}
          </h3>
          <div className="flex flex-col gap-2 items-center md:items-start">
            {timeSlots.map((time: string, idx: number) => (
              <button
                key={idx}
                className="w-full border border-gray-700 rounded-md py-2 text-sm hover:bg-[#00c46a] hover:text-black transition"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookingModal;