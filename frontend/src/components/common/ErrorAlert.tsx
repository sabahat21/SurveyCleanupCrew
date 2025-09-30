import React from "react";

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => (
  <div className="max-w-4xl mx-auto px-6 pt-4">
    <div className="bg-error-bg border border-error-border rounded-lg p-4 text-center">
      <p className="text-error-text text-lg">{message}</p>
      <button
        onClick={onDismiss}
        className="text-error-dismiss-text hover:text-error-dismiss-hover text-sm underline mt-1"
      >
        Dismiss
      </button>
    </div>
  </div>
);

export default ErrorAlert;
