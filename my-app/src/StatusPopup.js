import React from 'react';

const popupStyles = {
  success: 'border-green-500/40 bg-green-500/15 text-green-200',
  error: 'border-red-500/40 bg-red-500/15 text-red-200',
  info: 'border-orange-500/40 bg-orange-500/15 text-orange-200'
};

const popupTitles = {
  success: 'Registration Completed',
  error: 'Invalid Details',
  info: 'Please Wait'
};

const StatusPopup = ({ status, onClose }) => {
  if (!status?.message) {
    return null;
  }

  const type = status.type || 'info';

  return (
    <div className="fixed top-6 right-6 z-[200] w-[calc(100%-2rem)] max-w-sm">
      <div className={`rounded-2xl border shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl px-5 py-4 ${popupStyles[type] || popupStyles.info}`}>
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] opacity-80">
              {popupTitles[type] || popupTitles.info}
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed">
              {status.message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-current/70 hover:text-current transition-colors text-lg leading-none"
            aria-label="Close popup"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusPopup;
