import React from "react";

interface UserQuestionCardProps {
  questions: any[];
  answers: string[];
  index: number;
  error: string;
  showPreviewDialog: boolean;
  answeredCount: number;
  submitting: boolean;
  onAnswerChange: (value: string) => void;
  onSaveNext: () => void;
  onSkip: () => void;
  onPublish: () => void;
  onClosePreview: () => void;
  onLogout: () => void;
}

const UserQuestionCard: React.FC<UserQuestionCardProps> = ({
  questions,
  answers,
  index,
  error,
  showPreviewDialog,
  answeredCount,
  submitting,
  onAnswerChange,
  onSaveNext,
  onSkip,
  onPublish,
  onClosePreview,
  onLogout,
}) => {
  return (
    <main className="flex-grow flex items-center justify-center px-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-2xl relative border border-orange-100">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-3xl" style={{
          background: 'linear-gradient(to bottom right, rgba(242, 210, 182, 0.05), rgba(245, 200, 0, 0.05))'
        }}></div>

        {/* Level Badge & Logout */}
        <div className="relative flex justify-between items-start mb-8">
          <span className="px-4 py-2 text-white rounded-full text-sm font-bold uppercase tracking-wide shadow-lg" style={{
            background: 'var(--header-primary)'
          }}>
            {!showPreviewDialog ? questions[index]?.questionLevel : "SURVEY"} Level
          </span>
          <button
            onClick={onLogout}
            disabled={submitting}
            className="text-sm font-medium transition-colors duration-200 disabled:opacity-50"
            style={{
              color: 'var(--btn-logout-bg)'
            }}
          >
            Logout
          </button>
        </div>

        {/* Only show question content when not showing the preview dialog */}
        {!showPreviewDialog && (
          <>
            {/* Question Header */}
            <div className="relative mb-8 text-center">
              <h2 className="text-2xl font-bold mb-4" style={{
                color: 'var(--header-primary)'
              }}>
                {questions[index].question}
              </h2>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <textarea
                className="w-full border-2 rounded-2xl p-4 text-lg focus:ring-4 transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--primary)',
                  '--tw-ring-color': 'rgba(242, 210, 182, 0.3)'
                } as React.CSSProperties}
                placeholder={
                  answers[index] === "skip"
                    ? "This question has been skipped"
                    : "Share your thoughts here..."
                }
                rows={4}
                value={answers[index] === "skip" ? "" : answers[index]}
                disabled={answers[index] === "skip" || submitting}
                onChange={(e) => onAnswerChange(e.target.value)}
              />
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onSaveNext}
                disabled={submitting}
                className="px-8 py-3 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: 'var(--header-primary)'
                }}
              >
                {index === questions.length - 1
                  ? "Review Answers"
                  : "Save & Continue"}
              </button>

              <button
                onClick={onSkip}
                disabled={submitting}
                className={`px-8 py-3 rounded-2xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  answers[index] === "skip"
                    ? "bg-amber-200 text-amber-800 hover:bg-amber-300"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {answers[index] === "skip" ? "Unskip Question" : "Skip Question"}
              </button>
            </div>
          </>
        )}

        {/* Preview Dialog - always inside main container */}
        {showPreviewDialog && (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-green-200 rounded-2xl shadow-xl p-6 animate-in slide-in-from-top-2 duration-300"
          style={{ borderColor: 'var(--success)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full flex items-center justify-center"
                     style={{ background: 'var(--header-primary)' }}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--header-primary)' }}>
                  Survey Complete!
                </h3>
              </div>
              <button
                onClick={onClosePreview}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              You've answered {answeredCount} out of {questions.length}{" "}
              questions. Review your responses before submitting.
            </p>

            <div className="max-h-48 overflow-y-auto mb-4 space-y-3">
              {questions.map((q, i) => (
                <div
                  key={q.questionID || q._id || `question-${i}`} // FIX: Added proper key
                  className="rounded-xl p-3 text-sm"
                  style={{ backgroundColor: 'var(--primary-lighter)' }}
                >
                  <p className="font-medium text-gray-800 mb-1">
                    Q{i + 1}: {q.question.substring(0, 60)}
                    {q.question.length > 60 ? "..." : ""}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {answers[i] && answers[i] !== "skip"
                      ? answers[i].substring(0, 80) +
                        (answers[i].length > 80 ? "..." : "")
                      : answers[i] === "skip"
                      ? "Skipped"
                      : "No answer"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onPublish}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {submitting ? "Submitting..." : "Submit Survey"}
              </button>
              <button
                onClick={onClosePreview}
                disabled={submitting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 text-sm disabled:opacity-50"
              >
                Review More
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserQuestionCard;