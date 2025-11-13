import { axiosClient } from "./axios-client";

// Types
export interface Post {
    id: string;
    email: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    dislikes: number;
    user_reaction: "like" | "dislike" | null;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
}

export interface PostsResponse {
    success: boolean;
    data: Post[];
    pagination: Pagination;
}

export interface PostResponse {
    success: boolean;
    data: Post | null;
}

export interface CreatePostRequest {
    email: string;
    content: string;
}

export interface ReactionResponse {
    success: boolean;
    message: string;
    action: "liked" | "disliked" | "removed";
}

export interface MyReactionsResponse {
    success: boolean;
    data: {
        liked_posts: Post[];
        disliked_posts: Post[];
        total_liked: number;
        total_disliked: number;
        total_reactions: number;
    };
    pagination: Pagination;
}

// API Functions
export const postApi = {
    // Get all posts with pagination
    getPosts: async (params?: {
        email?: string;
        page?: number;
        limit?: number;
    }): Promise<PostsResponse> => {
        return axiosClient.get("/posts", { params });
    },

    // Get single post by ID
    getPostById: async (
        id: string,
        email?: string
    ): Promise<PostResponse> => {
        return axiosClient.get(`/posts/${id}`, {
            params: email ? { email } : undefined,
        });
    },

    // Create new post
    createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
        return axiosClient.post("/posts", data);
    },

    // Like a post
    likePost: async (id: string, email: string): Promise<ReactionResponse> => {
        return axiosClient.post(`/posts/${id}/like`, { email });
    },

    // Dislike a post
    dislikePost: async (
        id: string,
        email: string
    ): Promise<ReactionResponse> => {
        return axiosClient.post(`/posts/${id}/dislike`, { email });
    },

    // Get my reactions history
    getMyReactions: async (params: {
        email: string;
        page?: number;
        limit?: number;
    }): Promise<MyReactionsResponse> => {
        return axiosClient.get("/posts/my-reactions", { params });
    },

    // Get reactions details for a post
    getPostReactions: async (id: string) => {
        return axiosClient.get(`/posts/${id}/reactions`);
    },
};

