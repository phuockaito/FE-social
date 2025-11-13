import { HomeOutlined, HistoryOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";

export const BottomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isMyReactions = location.pathname === "/my-reactions";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-around py-3">
                    {/* Trang chủ */}
                    <button
                        onClick={() => navigate("/")}
                        className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${isHome
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                    >
                        <HomeOutlined className="text-xl" />
                        <span className="text-xs font-medium">Trang chủ</span>
                    </button>

                    {/* Lịch sử Reactions */}
                    <button
                        onClick={() => navigate("/my-reactions")}
                        className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${isMyReactions
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                    >
                        <HistoryOutlined className="text-xl" />
                        <span className="text-xs font-medium">Lịch sử</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

