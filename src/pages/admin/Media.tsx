import React, { useState } from "react";
import { Eye, Copy, Trash2, Check, Image } from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import {
  useMediaFetch,
  useDeleteMedia,
  useUploadMedia,
} from "../../hooks/admin/useMedia";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import ImagePreviewModal from "../../components/common/ImagePreviewModal";
import UploadMediaModal from "../../components/common/UploadMediaModal";

const Media: React.FC = () => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(15);
  const { data: mediaItems, isPending } = useMediaFetch({ page, per_page });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Preview Modal State Management
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia();

  const { mutateAsync: uploadMedia, isPending: isUploading } = useUploadMedia();

  // Utility tool: Copy image URL asset pipeline
  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Media copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open confirmation modal
  const handleDeleteItem = (id: string) => {
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

  const handleMediaUpload = async (
    files: File[],
    onProgress: (progress: number) => void,
  ) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      const res = await uploadMedia({
        formData,
        onProgress,
      });

      toast.success(res.message || "Upload successful!");
      setIsUploadOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Upload failed");
      throw err;
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1. TOP HEADER NAVIGATION BLOCK */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">
                Media Manager
              </h1>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Centralized assets grid for promotional banners, brand logos,
                and menu item vectors.
              </p>
            </div>

            <Button onClick={() => setIsUploadOpen(true)} />
          </div>

          {/* 2. CORE METRIC IMAGE CANVAS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {isPending ? (
              Array.from({ length: per_page }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50 shadow-sm animate-pulse"
                >
                  {/* Outer Pulsing Canvas Backdrop */}
                  <div className="w-full h-full bg-gray-200/80" />

                  <div className="absolute bottom-2 left-2 right-2 h-2.5 bg-gray-300/40 rounded-full" />
                </div>
              ))
            ) : mediaItems?.data?.length > 0 ? (
              mediaItems?.data?.map(
                (item: { media_path: string; id: string }, key: number) => (
                  <div
                    key={item.id || key}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200/80 bg-gray-50 group shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300"
                  >
                    {/* Native Render Image Graphic */}
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.media_path}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* INTERACTIVE HOVER OVERLAY BACKDROP */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 p-1 transition-all duration-200">
                      {/* HORIZONTAL ACTION TRIGGER BUTTONS GRID */}
                      <div className="flex items-center gap-1">
                        {/* Action 1: View File */}
                        <button
                          onClick={() => {
                            setPreviewUrl(
                              `${import.meta.env.VITE_API_BASE_URL}/storage/${item.media_path}`,
                            );
                            setIsPreviewOpen(true);
                          }}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/10 transition-all cursor-pointer active:scale-90"
                          title="Preview Image"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Action 2: Copy Path Hook */}
                        <button
                          onClick={() =>
                            handleCopyLink(
                              item.media_path,
                              `${import.meta.env.VITE_API_BASE_URL}/storage/${item.media_path}`,
                            )
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

                        {/* Action 3: Purge Rule */}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white backdrop-blur-md border border-red-500/10 transition-all cursor-pointer active:scale-90"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="col-span-full py-12 text-center text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-2xl">
                <div className="flex justify-center mb-4">
                  <Image className="w-[40px] h-[40px]" />
                </div>
                No Media Available!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. PAGINATION LAYER */}
      {!isPending && mediaItems?.data?.length > 0 && (
        <Pagination
          currentPage={mediaItems?.pagination?.current_page}
          totalPages={mediaItems?.pagination?.last_page}
          totalEntries={mediaItems?.pagination?.total}
          from={mediaItems?.pagination.from ?? 0}
          to={mediaItems?.pagination.to ?? 0}
          entriesPerPage={mediaItems?.pagination?.per_page}
          onPageChange={(page) => setPage(page)}
          onEntriesPerPageChange={(perPage) => {
            setPerPage(perPage);
            setPage(1);
          }}
        />
      )}

      {/* 4. CONFIRM DELETE DIALOG DICTIONARY */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Media Asset?"
        message="This action will permanently delete this food item photo from the server storage."
      />

      {/* 5. SMOOTH IMAGE PREVIEW LIGHTBOX */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setTimeout(() => setPreviewUrl(null), 300);
        }}
        imageUrl={previewUrl}
        imageTitle="Media Asset"
      />

      {/* 6. UPLOAD MEDIA MODAL */}
      <UploadMediaModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleMediaUpload}
        isUploading={isUploading}
      />
    </>
  );
};

export default Media;
