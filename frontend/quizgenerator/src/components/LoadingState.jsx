const LoadingState = () => (
  <section className="flex flex-col items-center pb-20 px-4">
    <div className="w-full max-w-xl text-center">
      <div className="inline-flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
        <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
        <div style={{ fontFamily: "system-ui, sans-serif" }}>
          <p className="text-stone-700 font-medium">Analyzing your landing page…</p>
          <p className="text-stone-400 text-sm mt-1">This usually takes 10-20 seconds</p>
        </div>
      </div>
    </div>
  </section>
);

export default LoadingState;
