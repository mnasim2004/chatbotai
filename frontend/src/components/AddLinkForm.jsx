import React, { useState } from 'react';
import { Link } from 'lucide-react';

export function AddLinkForm({ onClose, onAdd }) {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && description.trim()) {
      onAdd(url.trim(), description.trim());
      onClose();
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>
        {url && !isValidUrl(url) && (
          <p className="mt-1 text-xs text-red-600">Please enter a valid URL</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this link about?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          rows={2}
          required
        />
      </div>

      {/* Preview */}
      {url && description && isValidUrl(url) && (
        <div className="p-3 bg-gray-50 rounded-md border">
          <p className="text-xs font-medium text-gray-700 mb-1">Preview:</p>
          <div className="flex items-center space-x-2">
            <Link className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-600 truncate">{url}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!url.trim() || !description.trim() || !isValidUrl(url)}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Link
        </button>
      </div>
    </form>
  );
}