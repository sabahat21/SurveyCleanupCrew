import React from "react";

interface ProficiencyModalProps {
  show: boolean;
  proficiency: string;
  setProficiency: (level: string) => void;
  onConfirm: () => void;
}

const ProficiencyModal: React.FC<ProficiencyModalProps> = ({
  show,
  proficiency,
  setProficiency,
  onConfirm,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-proficiency-bg flex items-center justify-center z-50">
      <div className="bg-proficiency-card-bg rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
        <h2 data-cy="proficiency-title" className="text-xl font-bold mb-4 text-proficiency-primary">
          What's your Sanskrit proficiency level?
        </h2>
        <div className="flex flex-col gap-3 mb-6 ">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
                   data-cy={`${level.toLowerCase()}-button`} 
              className={`px-6 py-2 rounded text-lg font-medium border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-proficiency-primary focus:border-transparent
                ${
                  proficiency === level
                    ? "bg-proficiency-primary text-proficiency-active-text border-accent "
                    : "bg-proficiency-card-bg text-proficiency-level-text border-accent "
                }
                hover:bg-proficiency-hover hover:text-proficiency-active-text transition`}
              onClick={() => setProficiency(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <button
           data-cy="confirm-button"
          className="mt-2 px-6 py-2 bg-proficiency-confirm-bg text-proficiency-confirm-text rounded hover:bg-proficiency-hover transition"
          onClick={onConfirm}
          disabled={!proficiency}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ProficiencyModal;
