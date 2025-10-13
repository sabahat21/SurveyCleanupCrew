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
    <aside className="w-80 bg-white/80 backdrop-blur-sm shadow-xl flex flex-col p-6 overflow-hidden" 
           style={{ borderRight: `1px solid var(--primary)`, height: '100vh' }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--progress-text)' }}>
          Survey Progress
        </h2>
        <div className="w-full rounded-full h-3 shadow-inner" style={{ backgroundColor: 'var(--primary-lighter)' }} >
          <div
            className="h-3 rounded-full shadow-sm transition-all duration-500 ease-out"
            style={{
              background: `linear-gradient(to right, var(--header-primary), var(--secondary))`,
              width: `${(answeredCount / questions.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-sm mt-2 text-center font-medium" 
           style={{ color: 'var(--progress-text)' }} 
           data-testid="progress-count">
          {answeredCount} of {questions.length} completed
        </p>
      </div>

      <div className="mb-4">
        <p className="text-base font-semibold mb-3" style={{ color: 'var(--sidebar-text)' }}>
          Questions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-12">
        <ul className="space-y-2">
        {questions.map((q, i) => (
          <li
            key={q.questionID || q._id || `sidebar-question-${i}`} // FIX: Added proper key
            onClick={() => onSelectQuestion(i)}
            className={`group relative flex items-center justify-between px-4 py-3 rounded-xl text-sm cursor-pointer transition-all duration-200 ${
              index === i
                ? "text-white shadow-lg transform scale-105"
                : "hover:shadow-md hover:transform hover:scale-102"
            }`}

            //added some additional code below: color and hovering effects to the question numbers-> 
            style={index === i ? {
              background: 'linear-gradient(to right, var(--header-primary), var(--accent))',
              border: `2px solid var(--header-primary)`,
              color: 'var(--btn-active-text)'
            } : {
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (index !== i) {
                e.currentTarget.style.backgroundColor = 'var(--primary-lighter)';
              }
            }}
            onMouseLeave={(e) => {
              if (index !== i) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            //extra added code above till here. -in refractoring phase.
          >


            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={index === i ? {
                  backgroundColor: 'var(--header-primary)',
                  color: 'var(--btn-active-text)'
                } : {
                  backgroundColor: 'var(--primary)',
                  color: 'var(--sidebar-text)'
                }}
              >
                {i + 1}
              </div>
              
              <span
                className={`font-medium ${
                  index === i ? "text-white" : "text-gray-700"
                }`}
              >
                Question {i + 1}
              </span>
            </div>
            
            
            <div className="flex items-center gap-2">
              {answers[i] && answers[i] !== "skip" && (
                <div className="w-3 h-3 rounded-full shadow-sm " 
                     style={{ backgroundColor: 'var(--header-primary)' }} />
              )}
              {answers[i] === "skip" && (
                <div 
                className="w-3 h-3 rounded-full shadow-lg animate-ping" 
                     style={{ backgroundColor: 'var(--secondary)'  }} />
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