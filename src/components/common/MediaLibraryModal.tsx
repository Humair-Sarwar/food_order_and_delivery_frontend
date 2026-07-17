import React, { useState, useRef } from "react";
import {
  Upload,
  Check,
  Image as ImageIcon,
  Loader2,
  Eye,
  Copy,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { GenericModal } from "./GenericModal";
import Pagination from "../../components/common/Pagination"; // Path verify kar lein
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import ImagePreviewModal from "../../components/common/ImagePreviewModal";
import {
  useMediaFetch,
  useDeleteMedia,
  useAddMedia,
} from "../../hooks/admin/useMedia";

// Change interface to pass back an object containing both ID and URL
interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (media: { id: string | number; url: string }) => void;
  selectedId?: string | number; // Changed from selectedUrl to selectedId for strict data binding
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedId,
}) => {
  // --- PAGINATION & DATA FETCH STATES ---
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(12);
  const { data: mediaItems, isPending } = useMediaFetch({ page, per_page });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- LOCAL UPLOAD STATES ---
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SUB-MODALS STATES FOR PREVIEW & DELETE ---
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia();
  const { mutate: uploadMedia } = useAddMedia();

  // Handle asset file upload with size guard validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB conversion in bytes

    // Frontend guard clause checking for maximum allowed size constraint
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "File size exceeds 2MB limit. Please upload a smaller image.",
      );

      // Reset input element value so same file can be triggered again if resized
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);

    uploadMedia(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
        setIsUploading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (err: any) => {
        setIsUploading(false);
        toast.error(err?.response?.data?.message || "Failed to upload media.");
      },
    });
  };

  // Copy image URL utility pipeline
  const handleCopyLink = (e: React.MouseEvent, id: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Media copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open confirmation modal
  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedMediaId(id);
    setIsDeleteOpen(true);
  };

  // Perform delete action on confirmation
  const handleConfirmDelete = () => {
    if (!selectedMediaId) return;

    deleteMedia(selectedMediaId, {
      onSuccess: (res) => {
        if (mediaItems?.data?.length === 1 && page > 1) {
          setPage(page - 1);
        }
        toast.success(res.message);
        setIsDeleteOpen(false);
        setSelectedMediaId(null);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete media.");
      },
    });
  };

  return (
    <>
      <GenericModal
        isOpen={isOpen}
        onClose={onClose}
        title="Select Asset from Media Library"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6 pb-2">
          {/* --- 1. UPLOAD ZONE --- */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`group border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[120px] ${
              isUploading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-gray-500">
                  Uploading asset to server...
                </p>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-700">
                  Drag & drop or click to upload new media
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Supports PNG, JPG, JPEG up to 2MB
                </p>
              </>
            )}
          </div>

          {/* --- 2. IMAGES GRID --- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                All Assets ({mediaItems?.pagination?.total || 0})
              </h4>
              {selectedId && (
                <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Active selection detected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {isPending ? (
                Array.from({ length: per_page }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50 shadow-sm animate-pulse"
                  >
                    <div className="w-full h-full bg-gray-200/80" />
                    <div className="absolute bottom-2 left-2 right-2 h-2.5 bg-gray-300/40 rounded-full" />
                  </div>
                ))
              ) : mediaItems?.data?.length > 0 ? (
                mediaItems?.data?.map(
                  (item: { media_path: string; id: string }, key: number) => {
                    const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${item.media_path}`;
                    // Matching via database unique id instead of string matching strings
                    const isSelected = String(selectedId) === String(item.id);

                    return (
                      <div
                        key={item.id || key}
                        onClick={() => {
                          // Passing back structural object composition to the consumer component
                          onSelectImage({ id: item.id, url: imageUrl });
                          onClose();
                        }}
                        className={`group relative aspect-square cursor-pointer rounded-xl overflow-hidden border bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md ${
                          isSelected
                            ? "border-blue-600 ring-4 ring-blue-100 scale-[0.98]"
                            : "border-gray-200/80 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={imageUrl}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          alt="Library Asset"
                        />

                        {/* HOVER OVERLAY */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 p-1 transition-all duration-200">
                          <div className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-blue-600 text-white flex items-center gap-0.5 shadow-sm">
                            Select <ArrowUpRight className="w-2.5 h-2.5" />
                          </div>

                          {/* THREE ACTION BUTTONS */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewUrl(imageUrl);
                                setIsPreviewOpen(true);
                              }}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/10 transition-all cursor-pointer active:scale-90"
                              title="Preview Image"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) =>
                                handleCopyLink(e, item.media_path, imageUrl)
                              }
                              className={`h-7 w-7 inline-flex items-center justify-center rounded-lg backdrop-blur-md border transition-all cursor-pointer active:scale-90 ${
                                copiedId === item?.media_path
                                  ? "bg-emerald-500 border-transparent text-white"
                                  : "bg-white/20 hover:bg-white text-white hover:text-gray-900 border-white/10"
                              }`}
                              title="Copy Image URL"
                            >
                              {copiedId === item?.media_path ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteItem(e, item.id)}
                              className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white backdrop-blur-md border border-red-500/10 transition-all cursor-pointer active:scale-90"
                              title="Delete Asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md border border-white">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  },
                )
              ) : (
                <div className="col-span-full py-12 text-center text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-2xl">
                  No media components matched the query filters.
                </div>
              )}
            </div>
          </div>

          {/* --- 3. PAGINATION BLOCK --- */}
          {!isPending && mediaItems?.data?.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <Pagination
                currentPage={mediaItems?.pagination?.current_page}
                totalPages={mediaItems?.pagination?.last_page}
                totalEntries={mediaItems?.pagination?.total}
                from={mediaItems?.pagination?.from ?? 0}
                to={mediaItems?.pagination?.to ?? 0}
                entriesPerPage={mediaItems?.pagination?.per_page}
                onPageChange={(page) => setPage(page)}
                onEntriesPerPageChange={(perPage) => {
                  setPerPage(perPage);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      </GenericModal>

      {/* SUB-MODALS TREE */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Media Asset?"
        message="This action will permanently delete this photo from server storage."
      />

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setTimeout(() => setPreviewUrl(null), 300);
        }}
        imageUrl={previewUrl}
        imageTitle="Media Asset"
      />
    </>
  );
};
