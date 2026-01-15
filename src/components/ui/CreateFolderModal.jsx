import { useState } from "react";

const CreateFolderModal = ({ onClose }) => {
  const [folderName, setFolderName] = useState("");

  const handleCreate = () => {
    if (!folderName.trim()) return;
    console.log("Create folder:", folderName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] ">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Folder
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Organize your files efficiently
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg transition"
            >
              Create Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
