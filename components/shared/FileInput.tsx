
import React from 'react';
import { ImageFile } from '../../types';

interface FileInputProps {
  onFileSelect: (file: ImageFile | null) => void;
  selectedFile: ImageFile | null;
  accept?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string).split(',')[1];
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });
};

export const FileInput: React.FC<FileInputProps> = ({ onFileSelect, selectedFile, accept="image/*" }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onFileSelect({ base64, mimeType: file.type, name: file.name });
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload Image (Optional)</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-gray-400">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-900/70 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-indigo-500">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          {selectedFile && <p className="text-sm text-green-400 mt-2">{selectedFile.name}</p>}
        </div>
      </div>
    </div>
  );
};