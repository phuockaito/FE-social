import { Spin, Pagination, Empty, Alert, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { postApi } from "../api";
import { PostCard } from "./PostCard";

interface PostListProps {
    userEmail?: string;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export const PostList = ({
    userEmail,
    page,
    limit,
    onPageChange,
}: PostListProps) => {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["posts", { email: userEmail, page, limit }],
        queryFn: () =>
            postApi.getPosts({
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
                <Typography.Text className="mt-4 text-gray-500">Đang tải...</Typography.Text>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert
                message="Lỗi"
                description={
                    error && typeof error === "object" && "message" in error
                        ? String(error.message)
                        : "Không thể tải danh sách bài viết"
                }
                type="error"
                showIcon
                className="mb-4 rounded-xl border-0 shadow-lg"
            />
        );
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <div className="py-16">
                <Empty
                    description={
                        <span className="text-gray-500 font-medium">Chưa có bài viết nào</span>
                    }
                    className="py-12"
                >
                    <div className="text-6xl mb-4">📝</div>
                </Empty>
            </div>
        );
    }

    return (
        <div>
            <div className="grid gap-6">
                {data.data.map((post) => (
                    <PostCard key={post.id} post={post} userEmail={userEmail} />
                ))}
            </div>

            {data.pagination && data.pagination.total_pages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-white/20">
                        <Pagination
                            current={data.pagination.page}
                            total={data.pagination.total}
                            pageSize={data.pagination.limit}
                            onChange={onPageChange}
                            showSizeChanger={false}
                            showTotal={(total) => (
                                <span className="text-gray-600 font-medium">
                                    Tổng <span className="text-blue-600 font-bold">{total}</span> bài viết
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

