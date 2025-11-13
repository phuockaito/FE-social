import { useState } from "react";
import { Typography, Tabs } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { useUserEmail } from "../../hooks/useUserEmail";
import { MyReactionsList } from "../../components/MyReactionsList";
import { BottomNavbar } from "../../components/BottomNavbar";

const { Title } = Typography;

export function MyReactionsPage() {
    const userEmail = useUserEmail();
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<"liked" | "disliked">("liked");
    const limit = 10;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const tabItems = [
        {
            key: "liked",
            label: (
                <span className="flex items-center gap-2">
                    <LikeOutlined className="text-blue-500" />
                    <span>Đã Like</span>
                </span>
            ),
        },
        {
            key: "disliked",
            label: (
                <span className="flex items-center gap-2">
                    <DislikeOutlined className="text-red-500" />
                    <span>Đã Dislike</span>
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 pb-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="text-center">
                        <div className="inline-block mb-4">
                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl px-8 py-4 shadow-lg">
                                <Title level={1} className="mb-0 text-white !text-3xl md:!text-4xl font-bold">
                                    📚 Lịch sử Reactions
                                </Title>
                            </div>
                        </div>
                        <Typography.Text className="text-lg text-gray-700 font-medium block mt-4">
                            Xem lại các bài viết bạn đã like và dislike
                        </Typography.Text>
                    </div>
                </div>

                {/* Tabs */}
                {userEmail ? (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => {
                                setActiveTab(key as "liked" | "disliked");
                                setPage(1);
                            }}
                            items={tabItems}
                            className="[&_.ant-tabs-tab]:rounded-lg [&_.ant-tabs-tab-active]:bg-gradient-to-r [&_.ant-tabs-tab-active]:from-blue-50 [&_.ant-tabs-tab-active]:to-indigo-50"
                        />
                        <div className="mt-6">
                            <MyReactionsList
                                userEmail={userEmail}
                                type={activeTab}
                                page={page}
                                limit={limit}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <Typography.Text className="text-gray-600 text-lg">
                            Vui lòng đăng nhập để xem lịch sử reactions
                        </Typography.Text>
                    </div>
                )}
            </div>
            <BottomNavbar />
        </div>
    );
}

