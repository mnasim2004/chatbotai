import React, { useState } from 'react';
import { Users } from 'lucide-react';

export function AddSocialForm({ onClose, onAdd }) {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');

  const socialPlatforms = [
    'Twitter', 'LinkedIn', 'Instagram', 'Facebook', 'YouTube', 
    'TikTok', 'Discord', 'Telegram', 'WhatsApp', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (platform.trim() && url.trim()) {
      onAdd(platform.trim(), url.trim());
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
      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform
        </label>
        <div className="grid grid-cols-2 gap-2">
          {socialPlatforms.map((socialPlatform) => (
            <button
              key={socialPlatform}
              type="button"
              onClick={() => setPlatform(socialPlatform)}
              className={`p-2 text-xs rounded-md border transition-colors ${
                platform === socialPlatform
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {socialPlatform}
            </button>
          ))}
        </div>
        {platform === 'Other' && (
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Enter platform name"
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        )}
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://twitter.com/username"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>
        {url && !isValidUrl(url) && (
          <p className="mt-1 text-xs text-red-600">Please enter a valid URL</p>
        )}
      </div>

      {/* Preview */}
      {platform && url && isValidUrl(url) && (
        <div className="p-3 bg-gray-50 rounded-md border">
          <p className="text-xs font-medium text-gray-700 mb-1">Preview:</p>
          <div className="flex items-center space-x-2">
            <Users className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-700">{platform}:</span>
            <span className="text-xs text-blue-600 truncate">{url}</span>
          </div>
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
          disabled={!platform.trim() || !url.trim() || !isValidUrl(url)}
          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Social
        </button>
      </div>
    </form>
  );
}