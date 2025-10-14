import React from "react";

interface UpdateConfirmPromptProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const UpdateConfirmPrompt: React.FC<UpdateConfirmPromptProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-update-bg">
      <div className="bg-update-card-bg rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-update-primary mb-2">
          Update Survey?
        </h2>
        <p className="mb-6 text-update-text">
          Are you sure you want to update the existing survey?
        </p>
        <div className="flex justify-center gap-4">
          <button
            data-cy="update-confirm-button"
            className="px-6 py-3 bg-update-button-bg text-update-button-text rounded-lg hover:bg-update-button-hover transition-colors font-semibold"
            onClick={onConfirm}
          >
            Yes, Update
          </button>
          <button
            data-cy="update-cancel-button"
            className="px-6 py-3 bg-update-cancel-bg text-update-cancel-text rounded-lg hover:bg-update-cancel-hover transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConfirmPrompt;
