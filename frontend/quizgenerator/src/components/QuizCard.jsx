import { useState } from "react";

const LETTERS = ["A", "B", "C", "D"];

const QUESTION_TYPE_STYLES = {
  "Pain Awareness": {
    bg: "bg-rose-50 border-rose-200 text-rose-700",
    dot: "bg-rose-400",
  },
  "Failure/Barrier": {
    bg: "bg-orange-50 border-orange-200 text-orange-700",
    dot: "bg-orange-400",
  },
  "Desire/Goal": {
    bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-400",
  },
};

const getTypeStyle = (type) =>
  QUESTION_TYPE_STYLES[type] || {
    bg: "bg-stone-100 border-stone-200 text-stone-600",
    dot: "bg-stone-400",
  };

const QuizCard = ({ question_number, question_type, question, options }) => {
  const [selected, setSelected] = useState(null);
  const typeStyle = getTypeStyle(question_type);

  const getOptionStyle = (i) => {
    if (selected === i)
      return "bg-amber-50 border-amber-400 text-amber-800 scale-[1.01]";
    if (selected !== null)
      return "bg-stone-50 border-stone-200 text-stone-400 opacity-60";
    return "bg-stone-50 border-stone-200 text-stone-700 hover:border-amber-400 hover:bg-amber-50";
  };

  return (
    <div className="border border-stone-200 rounded-2xl p-6 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-bold tracking-widest text-stone-400 uppercase"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Question {question_number}
        </span>

        {/* Question type badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${typeStyle.bg}`}
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${typeStyle.dot}`} />
          {question_type}
        </span>
      </div>

      {/* Question text */}
      <p
        className="text-stone-800 font-medium text-base mb-5 leading-relaxed"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selected === null && setSelected(i)}
            disabled={selected !== null}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${getOptionStyle(i)}`}
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
              {LETTERS[i]}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Selection feedback */}
      {selected !== null && (
        <p
          className="mt-4 text-xs text-stone-400 italic"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          You selected:{" "}
          <span className="font-semibold text-amber-600">{options[selected]}</span>
        </p>
      )}
    </div>
  );
};

export default QuizCard;