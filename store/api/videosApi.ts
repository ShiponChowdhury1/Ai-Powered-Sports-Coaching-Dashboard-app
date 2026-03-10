import { baseApi } from "./baseApi";

export interface VideoItem {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  user_name: string;
  user_email: string;
  upload_date: string;
  ai_status: "Completed" | "Processing" | "Failed" | "Pending";
  flag_status: "None" | "Flagged" | "Reviewed";
}

export interface VideoStats {
  total_videos: number;
  completed: number;
  processing: number;
  failed: number;
  flagged: number;
}

export interface VideosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VideoItem[];
  stats: VideoStats;
}

export const videosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<VideosResponse, { page?: number; status?: string; flag?: string; search?: string }>({
      query: (params) => ({
        url: `/videos/list/`,
        params,
      }),
      providesTags: ["Videos"],
    }),
    reprocessVideo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/videos/${id}/reprocess/`,
        method: "POST",
      }),
      invalidatesTags: ["Videos"],
    }),
    deleteVideo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/videos/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Videos"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetVideosQuery,
  useReprocessVideoMutation,
  useDeleteVideoMutation,
} = videosApi;
