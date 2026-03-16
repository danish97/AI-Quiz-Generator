import { useState } from "react";

const LoadingDots = () => (
  <span className="inline-flex gap-1 items-center">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

const QuizCard = ({ question, options, correct, index }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="border border-stone-200 rounded-2xl p-6 bg-white shadow-sm"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-3">
        Question {index + 1}
      </p>
      <p className="text-stone-800 font-medium text-base mb-5 leading-relaxed">
        {question}
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const letter = ["A", "B", "C", "D"][i];
          const isSelected = selected === i;
          const isCorrect = i === correct;
          let bg = "bg-stone-50 border-stone-200 text-stone-700 hover:border-amber-400 hover:bg-amber-50";
          if (revealed && isCorrect) bg = "bg-emerald-50 border-emerald-400 text-emerald-800";
          else if (revealed && isSelected && !isCorrect) bg = "bg-red-50 border-red-300 text-red-700";
          else if (!revealed && isSelected) bg = "bg-amber-50 border-amber-400 text-amber-800";

          return (
            <button
              key={i}
              onClick={() => { setSelected(i); setRevealed(true); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${bg}`}
            >
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                {letter}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="mt-4 text-xs text-stone-500 italic">
          {selected === correct
            ? "✓ Correct! Well done."
            : `✗ The correct answer was ${["A", "B", "C", "D"][correct]}.`}
        </p>
      )}
    </div>
  );
};

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const isValidUrl = (str) => {
    try { new URL(str); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError("Please enter a URL.");
    if (!isValidUrl(url.trim())) return setError("Please enter a valid URL including http:// or https://");

    setError("");
    setLoading(true);
    setQuiz(null);

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setQuiz(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-['Georgia',serif]">
      {/* Decorative top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      {/* Hero / Form Section */}
      <section className="flex flex-col items-center justify-center px-4 pt-24 pb-16">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
            AI-Powered Quiz Generator
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center text-5xl md:text-6xl font-bold text-stone-900 leading-tight max-w-2xl mb-5"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
          Turn any landing page into a{" "}
          <em className="text-amber-500 not-italic">customer quiz</em>
        </h1>

        <p className="text-center text-stone-500 text-lg max-w-md mb-12 leading-relaxed"
          style={{ fontFamily: "system-ui, sans-serif" }}>
          Paste your URL below and we'll generate a tailored quiz that maps your
          visitor's journey — in seconds.
        </p>

        {/* Form Card */}
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label
              htmlFor="landing-url"
              className="text-sm font-semibold text-stone-600 tracking-wide"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Landing Page URL
            </label>
            <div className="flex gap-2">
              <input
                id="landing-url"
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                placeholder="https://your-landing-page.com"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                style={{ fontFamily: "system-ui, sans-serif" }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-stone-900 font-bold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-200 whitespace-nowrap"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {loading ? <LoadingDots /> : "Generate Quiz →"}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                <span>⚠</span> {error}
              </p>
            )}
          </form>

          {/* Trust signals */}
          <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-center gap-6 flex-wrap">
            {["Instant results", "No signup needed", "Free to use"].map((item) => (
              <span
                key={item}
                className="text-xs text-stone-400 flex items-center gap-1.5"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                <span className="text-emerald-400">✓</span> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="flex flex-col items-center pb-20 px-4">
          <div className="w-full max-w-xl text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
              <div style={{ fontFamily: "system-ui, sans-serif" }}>
                <p className="text-stone-700 font-medium">Analyzing your landing page…</p>
                <p className="text-stone-400 text-sm mt-1">This usually takes 10–20 seconds</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quiz Results */}
      {quiz && !loading && (
        <section className="px-4 pb-24">
          <div className="max-w-2xl mx-auto">
            {/* Results header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 mb-4">
                <span className="text-emerald-600 text-sm">✓</span>
                <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  Quiz Generated
                </span>
              </div>
              <h2 className="text-3xl font-bold text-stone-900 mb-2">
                {quiz.title || "Your Customer Journey Quiz"}
              </h2>
              {quiz.description && (
                <p className="text-stone-500 max-w-lg mx-auto leading-relaxed"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  {quiz.description}
                </p>
              )}
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-4">
              {(quiz.questions || []).map((q, i) => (
                <QuizCard
                  key={i}
                  index={i}
                  question={q.question}
                  options={q.options}
                  correct={q.correct ?? q.correctIndex ?? 0}
                />
              ))}
            </div>

            {/* Reset */}
            <div className="text-center mt-10">
              <button
                onClick={() => { setQuiz(null); setUrl(""); }}
                className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-600 text-sm font-medium transition-all"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                ← Generate another quiz
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center">
        <p className="text-xs text-stone-400" style={{ fontFamily: "system-ui, sans-serif" }}>
          Powered by AI · Built for marketers
        </p>
      </footer>
    </div>
  );
}
