import { memo } from "react";
import { Card, Button, message, Space, Typography } from "antd";
import {
    LikeOutlined,
    DislikeOutlined,
    UserOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, type Post } from "../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface PostCardProps {
    post: Post;
    userEmail?: string;
}

export const PostCard = memo(({ post, userEmail }: PostCardProps) => {
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: () => postApi.likePost(post.id, userEmail!),
        onSuccess: (data) => {
            if (data.action === "removed") {
                message.success({
                    content: "👍 Đã bỏ like bài viết",
                    duration: 2,
                    className: "custom-message",
                });
            } else if (post.user_reaction === "dislike") {
                message.success({
                    content: "🔄 Đã chuyển từ dislike sang like",
                    duration: 2,
                    className: "custom-message",
                });
            } else {
                message.success({
                    content: "❤️ Đã like bài viết thành công!",
                    duration: 2,
                    className: "custom-message",
                });
            }
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", post.id] });
            queryClient.invalidateQueries({ queryKey: ["my-reactions"] });
        },
        onError: (error: unknown) => {
            const errorMessage =
                error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : "Có lỗi xảy ra khi like bài viết";
            message.error({
                content: `❌ ${errorMessage}`,
                duration: 3,
                className: "custom-message-error",
            });
        },
    });

    const dislikeMutation = useMutation({
        mutationFn: () => postApi.dislikePost(post.id, userEmail!),
        onSuccess: (data) => {
            if (data.action === "removed") {
                message.success({
                    content: "👎 Đã bỏ dislike bài viết",
                    duration: 2,
                    className: "custom-message",
                });
            } else if (post.user_reaction === "like") {
                message.success({
                    content: "🔄 Đã chuyển từ like sang dislike",
                    duration: 2,
                    className: "custom-message",
                });
            } else {
                message.success({
                    content: "💔 Đã dislike bài viết",
                    duration: 2,
                    className: "custom-message",
                });
            }
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", post.id] });
            queryClient.invalidateQueries({ queryKey: ["my-reactions"] });
        },
        onError: (error: unknown) => {
            const errorMessage =
                error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : "Có lỗi xảy ra khi dislike bài viết";
            message.error({
                content: `❌ ${errorMessage}`,
                duration: 3,
                className: "custom-message-error",
            });
        },
    });

    const handleLike = () => {
        if (!userEmail) {
            message.warning({
                content: "⚠️ Vui lòng nhập email để like/dislike bài viết",
                duration: 3,
                className: "custom-message-warning",
            });
            return;
        }
        likeMutation.mutate();
    };

    const handleDislike = () => {
        if (!userEmail) {
            message.warning({
                content: "⚠️ Vui lòng nhập email để like/dislike bài viết",
                duration: 3,
                className: "custom-message-warning",
            });
            return;
        }
        dislikeMutation.mutate();
    };

    return (
        <Card
            className="mb-4 border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm transform hover:-translate-y-1"
        >
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                            <UserOutlined className="text-white text-sm" />
                        </div>
                        <div>
                            <Typography.Text strong className="text-gray-800 text-base">
                                {post.email}
                            </Typography.Text>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                        <ClockCircleOutlined className="text-gray-400 text-xs" />
                        <Typography.Text type="secondary" className="text-xs font-medium">
                            {dayjs(post.created_at).fromNow()}
                        </Typography.Text>
                    </div>
                </div>

                {/* Content */}
                <Typography.Paragraph className="mb-0 whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                    {post.content}
                </Typography.Paragraph>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Space size="middle">
                        <Button
                            type={post.user_reaction === "like" ? "primary" : "default"}
                            icon={<LikeOutlined />}
                            onClick={handleLike}
                            loading={likeMutation.isPending}
                            disabled={!userEmail}
                            className={`rounded-lg font-medium transition-all duration-200 ${post.user_reaction === "like"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-md hover:shadow-lg"
                                : "hover:bg-blue-50 hover:border-blue-300"
                                }`}
                        >
                            <span className="ml-1">{post.likes}</span>
                        </Button>
                        <Button
                            type={
                                post.user_reaction === "dislike" ? "primary" : "default"
                            }
                            danger={post.user_reaction === "dislike"}
                            icon={<DislikeOutlined />}
                            onClick={handleDislike}
                            loading={dislikeMutation.isPending}
                            disabled={!userEmail}
                            className={`rounded-lg font-medium transition-all duration-200 ${post.user_reaction === "dislike"
                                ? "bg-gradient-to-r from-red-500 to-pink-600 border-0 shadow-md hover:shadow-lg"
                                : "hover:bg-red-50 hover:border-red-300"
                                }`}
                        >
                            <span className="ml-1">{post.dislikes}</span>
                        </Button>
                    </Space>

                    {post.user_reaction && (
                        <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
                            <Typography.Text className="text-xs font-medium text-blue-700">
                                ✓ Bạn đã {post.user_reaction === "like" ? "like" : "dislike"}
                            </Typography.Text>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
});

