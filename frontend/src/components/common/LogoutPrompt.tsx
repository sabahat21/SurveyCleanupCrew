import React from "react";

interface LogoutPromptProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutPrompt: React.FC<LogoutPromptProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-logout-bg flex items-center justify-center z-50">
      <div className="bg-logout-card-bg rounded-lg shadow-lg p-8 w-full max-w-xs text-center">
        <h2 className="text-xl font-bold mb-4 text-logout-primary">Logout?</h2>
        <p className="mb-6 text-logout-text">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 bg-logout-primary text-logout-button-text rounded hover:bg-logout-hover"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
          <button
            className="px-6 py-2 bg-logout-cancel-bg text-logout-cancel-text rounded hover:bg-logout-cancel-hover"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPrompt;
