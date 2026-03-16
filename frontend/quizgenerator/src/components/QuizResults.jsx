import QuizCard from "./QuizCard";

const InfoPill = ({ label, value }) => (
  <div
    className="flex flex-col gap-0.5"
    style={{ fontFamily: "system-ui, sans-serif" }}
  >
    <span className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
      {label}
    </span>
    <span className="text-sm text-stone-700 font-medium">{value}</span>
  </div>
);

const QuizResults = ({ quizData, onReset }) => {
  const { target_audience, marketing_angles, product_details, quiz_questions } = quizData;

  return (
    <section className="px-4 pb-24">
      <div className="max-w-2xl mx-auto">

        {/* Success badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 mb-4">
            <span className="text-emerald-600 text-sm">✓</span>
            <span
              className="text-xs font-semibold tracking-wider text-emerald-700 uppercase"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Quiz Generated
            </span>
          </div>
          <h2
            className="text-3xl font-bold text-stone-900"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            {product_details.product_name}
          </h2>
        </div>

        {/* Product & Audience summary card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3
            className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Campaign Overview
          </h3>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <InfoPill label="Marketing Angle" value={marketing_angles} />
            <InfoPill label="Tone" value={product_details.tone} />
          </div>

          <div className="mb-5">
            <InfoPill label="Target Audience" value={target_audience.demographics} />
          </div>

          <div className="mb-5">
            <span
              className="text-xs font-semibold tracking-wider text-stone-400 uppercase block mb-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Persona
            </span>
            <p
              className="text-sm text-stone-600 leading-relaxed"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {target_audience.persona_summary}
            </p>
          </div>

          {/* Pain points */}
          <div className="mb-5">
            <span
              className="text-xs font-semibold tracking-wider text-stone-400 uppercase block mb-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Pain Points
            </span>
            <p
              className="text-sm text-stone-600 leading-relaxed"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {target_audience.pain_points}
            </p>
          </div>

          {/* Desires */}
          <div className="mb-5">
            <span
              className="text-xs font-semibold tracking-wider text-stone-400 uppercase block mb-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Desires
            </span>
            <div className="flex flex-wrap gap-2">
              {target_audience.desires.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Key benefits */}
          <div>
            <span
              className="text-xs font-semibold tracking-wider text-stone-400 uppercase block mb-2"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Key Benefits
            </span>
            <div className="flex flex-col gap-1.5">
              {product_details.key_benefits.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-2 text-sm text-stone-600"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <span className="text-emerald-500 shrink-0">✓</span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz questions */}
        <h3
          className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 px-1"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Quiz Questions ({quiz_questions.length})
        </h3>

        <div className="flex flex-col gap-4">
          {quiz_questions.map((q) => (
            <QuizCard
              key={q.question_number}
              question_number={q.question_number}
              question_type={q.question_type}
              question={q.question}
              options={q.options}
            />
          ))}
        </div>

        {/* Reset */}
        <div className="text-center mt-10">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-600 text-sm font-medium transition-all"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            ← Generate another quiz
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuizResults;