import React, { useState, useRef, useEffect } from "react";
import {
  X,
  UploadCloud,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface UploadMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    files: File[],
    onProgress: (progress: number) => void,
  ) => Promise<void>;
  isUploading?: boolean; // Optional parent state
}

const FilePreviewRow: React.FC<{
  file: File;
  onRemove: () => void;
  isUploading: boolean;
}> = ({ file, onRemove, isUploading }) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs">
      <div className="flex items-center gap-3 overflow-hidden">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            className="w-10 h-10 object-cover rounded-xl border border-gray-200/50 bg-white"
          />
        )}
        <div className="flex flex-col truncate">
          <span className="font-bold text-gray-800 truncate max-w-[200px]">
            {file.name}
          </span>
          <span className="text-[10px] font-semibold text-gray-400">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>

      {!isUploading && (
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading: parentIsUploading = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localIsUploading, setLocalIsUploading] = useState(false); // Local state to manage upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine parent and local upload state
  const isCurrentlyUploading = parentIsUploading || localIsUploading;

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCurrentlyUploading) handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isCurrentlyUploading]);

  const validateAndAddFiles = (filesList: FileList) => {
    setErrorMsg(null);
    const validFiles: File[] = [];
    const skippedFiles: string[] = [];

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];

      if (!ALLOWED_TYPES.includes(file.type)) {
        skippedFiles.push(`${file.name} (invalid type)`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        skippedFiles.push(`${file.name} (exceeds 5MB)`);
        continue;
      }

      const isDuplicate = selectedFiles.some(
        (f) => f.name === file.name && f.size === file.size,
      );

      if (!isDuplicate) {
        validFiles.push(file);
      }
    }

    if (skippedFiles.length > 0) {
      setErrorMsg(
        `Skipped ${skippedFiles.length} file(s) due to size/type limits.`,
      );
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0 || isCurrentlyUploading) return;

    try {
      setLocalIsUploading(true); // Start local upload state
      setUploadProgress(0);

      await onUpload(selectedFiles, (progress) => {
        setUploadProgress(progress);
      });

      setSelectedFiles([]);
      setUploadProgress(0);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setLocalIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isCurrentlyUploading) return;
    setSelectedFiles([]);
    setErrorMsg(null);
    setUploadProgress(0);
    onClose();
  };

  const triggerFileInput = () => {
    if (!isCurrentlyUploading) fileInputRef.current?.click();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto visible"
          : "opacity-0 pointer-events-none invisible"
      }`}
    >
      {/* 1. Backdrop Overlay */}
      <div
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[4px] cursor-pointer transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* 2. Modal Card Container */}
      <div
        className={`relative w-full max-w-lg bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl shadow-gray-900/20 z-10 transition-all duration-300 ease-out transform ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-6 opacity-0"
        }`}
      >
        {/* Header Block */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">
              Assets Import
            </span>
            <h4 className="text-gray-900 text-sm font-black tracking-tight">
              Upload Media Assets
            </h4>
          </div>

          <button
            onClick={handleClose}
            disabled={isCurrentlyUploading}
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer disabled:opacity-50"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl p-3 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Drag and Drop Zone Container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/50 scale-[0.99]"
              : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
          } ${isCurrentlyUploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={ALLOWED_TYPES.join(",")}
            disabled={isCurrentlyUploading}
          />

          <div className="p-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-gray-400 mb-3">
            <UploadCloud className="w-6 h-6 text-gray-500" />
          </div>

          <p className="text-xs font-black text-gray-900 tracking-tight">
            Drag & drop images here, or{" "}
            <span className="text-emerald-600 hover:text-emerald-700 font-bold">
              browse
            </span>
          </p>
          <p className="text-[10px] font-semibold text-gray-400 mt-1">
            Supports JPEG, PNG, WEBP, GIF, SVG up to 2MB (Multiple uploads
            allowed)
          </p>
        </div>

        {/* Files Selected Preview Queue */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-3 max-h-[200px] overflow-y-auto pr-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Selected Files ({selectedFiles.length})
            </div>
            {selectedFiles.map((file, index) => (
              <FilePreviewRow
                key={`${file.name}-${index}`}
                file={file}
                isUploading={isCurrentlyUploading}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        )}

        {/* Upload Progress Segment */}
        {isCurrentlyUploading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <span>Uploading Assets...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions Panel */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
          <button
            onClick={handleClose}
            disabled={isCurrentlyUploading}
            className="h-9 px-4 inline-flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleUploadSubmit}
            disabled={selectedFiles.length === 0 || isCurrentlyUploading}
            className="h-9 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black disabled:opacity-50 transition-all active:scale-95 cursor-pointer shadow-md shadow-emerald-500/10"
          >
            {isCurrentlyUploading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMediaModal;
