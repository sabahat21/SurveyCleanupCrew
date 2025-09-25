// Updated Header.tsx - Improved colors, text clarity, and layout spacing
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutPrompt from "../common/LogoutPrompt";
import UpdatePrompt from "../common/UpdateConfirmPrompt";

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  mode: "create" | "edit";
  onPreview(): void;
  onCreateNew(): void;
  onUpdate(): void; // Now used for batch updates only
  onSwitchToCreate(): void;
  onSwitchToEdit(): void;
  isSubmitting: boolean;
  onLogout(): void;
}

export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalCount,
  mode,
  onPreview,
  onCreateNew,
  onUpdate,
  onSwitchToCreate,
  onSwitchToEdit,
  isSubmitting,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const handleLogoutClick = () => setShowLogoutPrompt(true);
  const handleConfirmLogout = () => {
    setShowLogoutPrompt(false);
    onLogout();
  };
  const handleCancelLogout = () => setShowLogoutPrompt(false);

  // Update popup logic - now for batch operations only
  const handleUpdateClick = () => setShowUpdatePrompt(true);
  const handleConfirmUpdate = () => {
    setShowUpdatePrompt(false);
    onUpdate();
  };
  const handleCancelUpdate = () => setShowUpdatePrompt(false);

  const rankingPageUrl = process.env.REACT_APP_RANKING_UI_URL;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-primary bg-opacity-95 backdrop-blur-sm border-b-2 border-indigo-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-header-primary rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-bold">SB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-header-primary tracking-tight">
                  Survey Builder
                </h1>
                <span className="text-sm text-header-subtitle font-medium tracking-wide">
                  Administrative Dashboard
                </span>
              </div>
            </div>

            {/* Center: Mode Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSwitchToCreate}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm border transition-all duration-200 ${
                  mode === "create"
                    ? "bg-secondary text-btn-active-text border-accent shadow-md"
                    : "bg-secondary-light text-btn-inactive-text border-accent hover:bg-emerald-50 hover:border-emerald-300"
                }`}
              >
                <span className="text-base ">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </span>
                <span>Add</span>
              </button>
              <button
                onClick={onSwitchToEdit}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm border transition-all duration-200 ${
                  mode === "edit"
                    ? "bg-secondary text-btn-active-text border-accent shadow-md"
                    : "bg-secondary-light text-btn-inactive-text border-accent hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                <span className="text-base">✏️</span>
                <span>Edit</span>
              </button>
            </div>

            {/* Right: Navigation & Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Navigation Buttons */}
              <button
                onClick={() => navigate("/analytics")}
                className="flex items-center gap-2 px-4 py-2.5 text-btn-analytics-text bg-btn-analytics-bg border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 font-medium text-sm"
              >
                <span className="text-base">📊</span>
                <span>Analytics</span>
              </button>

              <button
                onClick={() => window.open(rankingPageUrl, "_blank")}
                className="flex items-center gap-2 px-4 py-2.5 text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all duration-200 font-medium text-sm"
              >
                <span className="text-base">🏆</span>
                <span>Ranking Page</span>
              </button>

              <button
                onClick={onPreview}
                className="flex items-center gap-2 px-4 py-2.5 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 font-medium text-sm"
              >
                <span className="text-base">👁️</span>
                <span>Preview</span>
              </button>

              {/* Action Button */}
              {mode === "create" ? (
                <button
                  onClick={onCreateNew}
                  disabled={isSubmitting || completedCount === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-md"
                >
                  <span className="text-base">💾</span>
                  <span>{isSubmitting ? "Creating..." : "Save Questions"}</span>
                </button>
              ) : (
                <button
                  onClick={handleUpdateClick}
                  disabled={isSubmitting || completedCount === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-md"
                >
                  <span className="text-base">🔄</span>
                  <span>{isSubmitting ? "Updating..." : "Save Changes"}</span>
                </button>
              )}

              {/* Logout Button - Right Corner */}
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-btn-logout-bg text-btn-logout-text border border-red-200 rounded-lg hover:bg-red-700 hover:border-red-300 transition-all duration-200 font-medium text-sm"
              >
                <span className="text-base">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200"></div>
      </header>

      {/* LOGOUT MODAL */}
      <LogoutPrompt
        show={showLogoutPrompt}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      {/* BATCH UPDATE MODAL */}
      <UpdatePrompt
        show={showUpdatePrompt}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      />
    </>
  );
};
