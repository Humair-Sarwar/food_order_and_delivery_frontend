import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNewMedia, deleteMedia, MediaGet, uploadMedia } from "../../services/admin/mediaService";

interface MediaFetchProps {
  page: number;
  per_page: number;
}

export const useMediaFetch = ({ page, per_page }: MediaFetchProps) => {
  return useQuery({
    queryKey: ["medias", page, per_page],
    queryFn: () => MediaGet({ page, per_page }),
  });
};


// ================= DELETE MEDIA =================

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medias"],
      });
    },
  });
};



// ================= UPLOAD MEDIA =================

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      onProgress,
    }: {
      formData: FormData;
      onProgress?: (progress: number) => void;
    }) =>
      uploadMedia(formData, onProgress),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medias"],
      });
    },
  });
};




export const useAddMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medias"],
      });
    },
  });
};