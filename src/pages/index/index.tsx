import { useState } from "react";
import { Typography, Divider } from "antd";
import { CreatePostForm } from "../../components/CreatePostForm";
import { PostList } from "../../components/PostList";
import { useUserEmail } from "../../hooks/useUserEmail";
import { BottomNavbar } from "../../components/BottomNavbar";

const { Title } = Typography;

export function HomePage() {
    const userEmail = useUserEmail();
    const [page, setPage] = useState(1);
    const limit = 10;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 pb-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-block mb-4">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl px-8 py-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <Title level={1} className="mb-0 text-white !text-3xl md:!text-4xl font-bold">
                                ✨ Mini App
                            </Title>
                        </div>
                    </div>
                    <Typography.Text className="text-lg text-gray-700 font-medium block mt-4">
                        Chia sẻ suy nghĩ của bạn và tương tác với cộng đồng
                    </Typography.Text>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>

                {/* Create Post Form */}
                {userEmail && (
                    <>
                        <CreatePostForm
                            userEmail={userEmail}
                            onSuccess={() => setPage(1)}
                        />
                        <Divider />
                    </>
                )}

                {/* Posts List */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <Title level={3} className="mb-0 text-gray-800">
                            Danh sách bài viết
                        </Title>
                        <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    </div>
                    <PostList
                        userEmail={userEmail}
                        page={page}
                        limit={limit}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <BottomNavbar />
        </div>
    );
}
