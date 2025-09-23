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
    <div className="fixed inset-0 bg-secondary-light flex items-center justify-center z-50">
      <div className="bg-bg-card rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4 text-header-primary">
          What's your Sanskrit proficiency level?
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              className={`px-6 py-2 rounded text-lg font-medium border
                ${
                  proficiency === level
                    ? "bg-header-primary text-text-on-red border-accent"
                    : "bg-bg-card text-header-primary border-accent"
                }
                hover:bg-header-accent hover:text-text-on-red transition`}
              onClick={() => setProficiency(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <button
          className="mt-2 px-6 py-2 bg-header-primary text-text-on-red rounded hover:bg-header-accent transition"
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
