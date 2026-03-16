import { useState } from "react";
import UrlForm from "./components/UrlForm";
import LoadingState from "./components/LoadingState";
import QuizResults from "./components/QuizResults";
import Footer from "./components/Footer";
import api from "./lib/api";

const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const handleUrlChange = (value) => {
    setUrl(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError("Please enter a URL.");
    if (!isValidUrl(url.trim()))
      return setError("Please enter a valid URL including http:// or https://");

    setError("");
    setLoading(true);
    setQuiz(null);

    try {
      const response = await api.post("/generate", {
        landing_page_url: url.trim(),
      });

      const data = response.data;
      if (data.status !== "success" || !data.quiz_data)
        throw new Error("Unexpected response from server.");
      setQuiz(data.quiz_data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errorData = err.response.data;
        if (errorData.landing_page_url) {
          setError(`Invalid URL: ${errorData.landing_page_url.join(' ')}`);
        } else {
          setError("Bad request. Please check the URL.");
        }
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setUrl("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-['Georgia',serif]">
      {/* Decorative top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      <UrlForm
        url={url}
        setUrl={handleUrlChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />

      {loading && <LoadingState />}

      {quiz && !loading && (
        <QuizResults quizData={quiz} onReset={handleReset} />
      )}

      <Footer />
    </div>
  );
}