import React from "react";

interface UserSidebarProps {
  questions: any[];
  answers: string[];
  index: number;
  answeredCount: number;
  onSelectQuestion: (i: number) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  questions,
  answers,
  index,
  answeredCount,
  onSelectQuestion,
}) => {
  return (
    <aside className="w-80 h-screen bg-white/80 backdrop-blur-sm shadow-xl flex flex-col rounded-2xl overflow-hidden p-6 border-r border-sb-primary">
      <div className="mb-6 pr-6">
        <h2 className="text-xl font-bold mb-2 text-sb-progress-text">
          Survey Progress
        </h2>
        <div className="relative w-full h-3 rounded-full bg-sb-border overflow-hidden">
          <div
            className="h-3 rounded-full shadow-sm transition-all duration-500 ease-out bg-gradient-to-r from-sb-progress-bar-from to-sb-progress-bar-to" style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm mt-2 text-center font-medium text-sb-progress-text" data-testid="progress-count">
          {answeredCount} of {questions.length} completed
        </p>
      </div>

      <div className="mb-4 pr-6">
        <p className="text-base font-semibold mb-3 text-sb-text">
          Questions
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-12 pr-3 [scrollbar-gutter:stable]">
        <ul className="space-y-2">
        {questions.map((q, i) => (
          <li
            key={q.questionID || q._id || `sidebar-question-${i}`} // FIX: Added proper key
            onClick={() => onSelectQuestion(i)}
            className={`group relative flex items-center justify-between px-4 py-3 rounded-xl text-sm cursor-pointer transition-all duration-200 ${
              index === i
                ? "text-btn-active-text shadow-lg transform scale-105 border-2 border-sb-active-border bg-gradient-to-r from-sb-progress-bar-from to-sb-progress-bar-to"
                : "hover:shadow-md hover:bg-sb-hover-bg"
            }`}
          >


            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                 index === i ? 'bg-sb-active-border text-btn-active-text' : 'bg-sb-border text-sb-text'
                }`}
              >
                {i + 1}
              </div>
              
              <span
                className={`font-medium ${
                  index === i ? "text-white" : "text-sb-text"
                }`}
              >
                Question {i + 1}
              </span>
            </div>
            
            
            <div className="flex items-center gap-2">
              {answers[i] && answers[i] !== "skip" && (
                <div className="w-3 h-3 rounded-full shadow-sm bg-sb-indicator-active" />
              )}
              {answers[i] === "skip" && (
                <div 
                className="w-3 h-3 rounded-full shadow-lg animate-ping bg-sb-indicator-skip"/>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="h-6" />
      </div>
    </aside>
  );
};

export default UserSidebar;