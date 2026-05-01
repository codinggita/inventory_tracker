import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onFileSelect, accept = "image/*", maxSize = 5242880 }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    // Validation
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (onFileSelect) onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-4">
      {!file ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
            ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files[0])}
            accept={accept}
            className="hidden"
          />
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 mb-3">
            <Upload size={24} />
          </div>
          <p className="text-sm font-black text-slate-700">Click or drag to upload</p>
          <p className="text-xs text-slate-400 font-bold mt-1">PNG, JPG or WEBP (max 5MB)</p>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-red-500 font-bold"
            >
              {error}
            </motion.p>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <File className="text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-800 truncate">{file.name}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
