// src/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Question, Answer } from "../../types/types";
import { StatsOverview } from "./StatsOverview";
import { ChartContainer } from "./ChartContainer";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

// 🔹 Utility: Unified error + empty check
const isEmptyError = (e: any) =>
  e.message?.includes("404") || e.message?.includes("No questions") || e.message?.includes("empty");

// 🔹 Reusable Page Wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[var(--survey-bg)] p-6 space-y-6">{children}</div>
);

// 🔹 Header Component
const AnalyticsHeader: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const buttons = [
    { label: "🔄 Refresh", onClick: onRefresh },
    { label: "📋 Responses", onClick: () => navigate("/responses") },
    { label: "← Back", onClick: () => navigate("/dashboard") },
  ];
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
      <h2 className="text-3xl font-bold text-[var(--header-primary)]">Survey Analytics Dashboard</h2>
      <div className="flex flex-wrap justify-start sm:justify-end gap-2 w-full sm:w-auto">
        {buttons.map(({ label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="bg-button-refresh-responses-back text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

// 🔹 Loading State
const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-purple-700 text-lg font-medium">Loading analytics...</p>
    </div>
  </div>
);

// 🔹 Empty State
const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-blue-900 mb-2">No Survey Data Available</h3>
      <p className="text-blue-700 mb-4">
        There are no questions in your survey database yet. Please create some questions first to view analytics.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Go to Admin Dashboard
      </button>
    </div>
  );
};

// 🔹 Error State
const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-red-600 mb-4">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-lg font-semibold">Error loading analytics</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
    <button
      onClick={onRetry}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const AnalyticsPage: React.FC<{
  fetchAllQuestionsAndAnswersAdmin: () => Promise<{ questions: Question[]; answers: Answer[] }>;
}> = ({ fetchAllQuestionsAndAnswersAdmin }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  // 🔹 Unified data fetcher
  const loadData = async () => {
    setLoading(true);
    setErr(null);
    setIsEmpty(false);
    try {
      const { questions: q, answers: a } = await fetchAllQuestionsAndAnswersAdmin();
      setQuestions(q);
      setAnswers(a);
      setIsEmpty(q.length === 0);
    } catch (e: any) {
      if (isEmptyError(e)) {
        setIsEmpty(true);
        setQuestions([]);
        setAnswers([]);
        setErr("No questions found in the database. Please add some questions first in the admin dashboard.");
      } else setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/login", { replace: true });
      return;
    }
    loadData();
  }, [fetchAllQuestionsAndAnswersAdmin, navigate]);

  // 🔹 Derived stats
  const totalAnswered = questions.reduce((s, q) => s + (q.timesAnswered || 0), 0);
  const totalSkipped = questions.reduce((s, q) => s + (q.timesSkipped || 0), 0);
  const totalResponses = totalAnswered + totalSkipped;
  const overallSkipRate = totalResponses ? ((totalSkipped / totalResponses) * 100).toFixed(1) : "0.0";

  const levelAnswerCounts = LEVELS.map((level) =>
    questions.filter((q) => q.questionLevel === level).reduce((sum, q) => sum + (q.timesAnswered || 0), 0)
  );
  const levelChartData = {
    labels: [...LEVELS],
    datasets: [
      {
        label: "Answers Submitted",
        data: levelAnswerCounts,
        backgroundColor: ["#e47215ff", "#f0560eff", "#fc3808ff"],
        borderRadius: 12,
      },
    ],
  };

  const mostSkipped = [...questions]
    .map((q) => {
      const total = (q.timesAnswered || 0) + (q.timesSkipped || 0);
      return { ...q, skipRate: total ? (((q.timesSkipped || 0) / total) * 100).toFixed(1) : "0.0" };
    })
    .sort((a, b) => Number(b.skipRate) - Number(a.skipRate))
    .slice(0, 3);

  // 🔹 Conditional render blocks
  if (loading) return <PageWrapper><AnalyticsHeader onRefresh={loadData} /><LoadingState /></PageWrapper>;
  if (isEmpty) return <PageWrapper><AnalyticsHeader onRefresh={loadData} /><EmptyState /></PageWrapper>;
  if (err && !isEmpty) return <PageWrapper><AnalyticsHeader onRefresh={loadData} /><ErrorState message={err} onRetry={loadData} /></PageWrapper>;

  return (
    <PageWrapper>
      <AnalyticsHeader onRefresh={loadData} />
      <StatsOverview
        totalResponses={totalResponses}
        totalAnswered={totalAnswered}
        totalSkipped={totalSkipped}
        overallSkipRate={overallSkipRate}
      />

      <ChartContainer>
        <div className="bg-white p-4 rounded shadow w-full max-w-[500px]">
          <h3 className="font-semibold text-lg mb-2 text-center">Answers Submitted Per Level</h3>
          <div className="h-[250px]">
            <Bar
              data={levelChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
            />
          </div>
        </div>
      </ChartContainer>

      <div className="mt-12 max-w-4xl mx-auto bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b font-semibold text-gray-900 text-lg flex items-center gap-2">🚩 Most Skipped Questions</div>
        <table className="w-full text-left">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-6 py-3">Question</th>
              <th className="px-6 py-3">Skip %</th>
            </tr>
          </thead>
          <tbody>
            {mostSkipped.length === 0 ? (
              <tr><td colSpan={2} className="px-6 py-3 text-gray-500">No skipped questions.</td></tr>
            ) : (
              mostSkipped.map((q, i) => (
                <tr key={q.questionID || i} className={i % 2 ? "bg-purple-25" : "bg-white"}>
                  <td className="px-6 py-3">
                    {q.question.length > 40 ? q.question.slice(0, 40) + "..." : q.question}
                  </td>
                  <td className="px-6 py-3">{q.skipRate}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
};

export default AnalyticsPage;
