import LoadingDots from "./LoadingDots";

const UrlForm = ({ url, setUrl, onSubmit, loading, error }) => {
  return (
    <section className="flex flex-col items-center justify-center px-4 pt-24 pb-16">
      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span
          className="text-xs font-semibold tracking-wider text-amber-700 uppercase"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          AI-Powered Quiz Generator
        </span>
      </div>

      {/* Headline */}
      <h1
        className="text-center text-5xl md:text-6xl font-bold text-stone-900 leading-tight max-w-2xl mb-5"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        Most landing pages talk.{" "}
        <em className="text-amber-500 not-italic">The best ones listen.</em>
      </h1>

      <p
        className="text-center text-stone-500 text-lg max-w-md mb-12 leading-relaxed"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        Paste your URL and we'll generate a quiz that uncovers what your visitors actually need — and nudges them to convert.
      </p>

      {/* Form Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 p-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
              onChange={(e) => setUrl(e.target.value)}
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
            <p
              className="text-sm text-red-500 flex items-center gap-1.5"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
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
  );
};

export default UrlForm;
