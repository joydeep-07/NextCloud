import React from "react";

const AskDelete = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="
          w-full max-w-md
          rounded-2xl
          bg-[var(--bg-secondary)]
          border border-[var(--border-light)]
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-light)]">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
           NEXT CLOUD
          </p>
        </div>

        {/* Message */}
        <div className="px-6 py-6">
          <h3 className="text-base font-semibold text-[var(--text-main)]">
            Are you sure you want to Delete this note?
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            This action cannot be undone. The note will be permanently deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onCancel}
            className="
              px-5 py-2
              rounded-sm
              text-sm font-medium
              text-[var(--text-secondary)]
              hover:text-[var(--text-main)]
              bg-[var(--border-light)]/70
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-5 py-2
              rounded-sm
              text-sm font-medium
              text-white
              bg-red-500/90
              hover:bg-red-500
              shadow-sm
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskDelete;
