import { Spin, Pagination, Empty, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { postApi } from "../api";
import { PostCard } from "./PostCard";

interface MyReactionsListProps {
    userEmail: string;
    type: "liked" | "disliked";
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export const MyReactionsList = ({
    userEmail,
    type,
    page,
    limit,
    onPageChange,
}: MyReactionsListProps) => {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["my-reactions", { email: userEmail, page, limit }],
        queryFn: () =>
            postApi.getMyReactions({
                email: userEmail,
                page,
                limit,
            }),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center py-16">
                <div className="relative">
                    <Spin size="large" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
                <Typography.Text className="mt-4 text-gray-500">
                    Đang tải...
                </Typography.Text>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <Typography.Text className="text-red-600">
                    {error && typeof error === "object" && "message" in error
                        ? String(error.message)
                        : "Không thể tải lịch sử reactions"}
                </Typography.Text>
            </div>
        );
    }

    const posts = type === "liked" ? data?.data.liked_posts : data?.data.disliked_posts;
    const total = type === "liked" ? data?.data.total_liked : data?.data.total_disliked;

    if (!posts || posts.length === 0) {
        return (
            <div className="py-16">
                <Empty
                    description={
                        <span className="text-gray-500 font-medium">
                            {type === "liked"
                                ? "Bạn chưa like bài viết nào"
                                : "Bạn chưa dislike bài viết nào"}
                        </span>
                    }
                    className="py-12"
                >
                    <div className="text-6xl mb-4">
                        {type === "liked" ? "👍" : "👎"}
                    </div>
                </Empty>
            </div>
        );
    }

    // Map posts to include user_reaction based on current tab type
    const postsWithReaction = posts.map((post) => ({
        ...post,
        user_reaction: type === "liked" ? ("like" as const) : ("dislike" as const),
    }));

    return (
        <div>
            {/* Stats */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                    <Typography.Text className="text-gray-700 font-medium">
                        {type === "liked" ? "📊 Tổng số bài đã like" : "📊 Tổng số bài đã dislike"}
                    </Typography.Text>
                    <Typography.Text className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {total || 0}
                    </Typography.Text>
                </div>
            </div>

            {/* Posts List */}
            <div className="grid gap-6">
                {postsWithReaction.map((post) => (
                    <PostCard key={post.id} post={post} userEmail={userEmail} />
                ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.total_pages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                        <Pagination
                            current={data.pagination.page}
                            total={total}
                            pageSize={data.pagination.limit}
                            onChange={onPageChange}
                            showSizeChanger={false}
                            showTotal={(total) => (
                                <span className="text-gray-600 font-medium">
                                    Tổng{" "}
                                    <span className="text-blue-600 font-bold">
                                        {total}
                                    </span>{" "}
                                    bài viết
                                </span>
                            )}
                            className="[&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-item-active]:bg-gradient-to-r [&_.ant-pagination-item-active]:from-blue-500 [&_.ant-pagination-item-active]:to-indigo-600 [&_.ant-pagination-item-active]:border-0 [&_.ant-pagination-item-active_a]:text-white"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

