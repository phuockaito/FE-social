import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Form, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi, type CreatePostRequest } from "../api";

interface CreatePostFormProps {
    userEmail: string;
    onSuccess?: () => void;
}

export const CreatePostForm = ({
    userEmail,
    onSuccess,
}: CreatePostFormProps) => {
    const [form] = Form.useForm();
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();


    const createPostMutation = useMutation({
        mutationFn: (data: CreatePostRequest) => postApi.createPost(data),
        onSuccess: () => {
            message.success("Đã tạo bài viết thành công!");
            form.resetFields();
            setIsExpanded(false); // Thu gọn form sau khi đăng bài thành công
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            onSuccess?.();
        },
        onError: (error: unknown) => {
            const errorMessage =
                error && typeof error === "object" && "message" in error
                    ? String(error.message)
                    : "Có lỗi xảy ra khi tạo bài viết";
            message.error(errorMessage);
        },
    });

    const handleSubmit = (values: { content: string }) => {
        createPostMutation.mutate({
            email: userEmail,
            content: values.content,
        });
    };

    const handleTextAreaClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    const handleCollapse = useCallback(() => {
        setIsExpanded(false);
        const content = form.getFieldValue("content");
        // Chỉ reset nếu không có nội dung
        if (!content || content.trim() === "") {
            form.resetFields();
        }
    }, [form]);

    // Handle click outside to collapse
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isExpanded &&
                formRef.current &&
                !formRef.current.contains(event.target as Node)
            ) {
                const content = form.getFieldValue("content");
                // Chỉ collapse nếu không có nội dung hoặc nội dung rỗng
                if (!content || content.trim() === "") {
                    handleCollapse();
                }
            }
        };

        // Handle blur on textarea
        const handleBlur = () => {
            // Delay để check nếu user click vào button submit
            setTimeout(() => {
                const content = form.getFieldValue("content");
                if (isExpanded && (!content || content.trim() === "")) {
                    // Check if focus is still within form
                    const currentFormRef = formRef.current;
                    if (
                        currentFormRef &&
                        !currentFormRef.contains(document.activeElement)
                    ) {
                        handleCollapse();
                    }
                }
            }, 200);
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
            const currentFormRef = formRef.current;
            const textarea = currentFormRef?.querySelector("textarea");
            if (textarea) {
                textarea.addEventListener("blur", handleBlur);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                if (textarea) {
                    textarea.removeEventListener("blur", handleBlur);
                }
            };
        }
    }, [isExpanded, form, handleCollapse]);

    return (
        <div className="sticky top-0 z-10 pb-4 mb-6">
            <div
                ref={formRef}
                className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 transition-all duration-300 ${isExpanded ? 'shadow-2xl scale-[1.01]' : 'shadow-lg'
                    }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl">✍️</span>
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Tạo bài viết mới
                        </h2>
                    </div>
                    {isExpanded && (
                        <Button
                            type="text"
                            onClick={handleCollapse}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Thu gọn
                        </Button>
                    )}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="content"
                        label={isExpanded ? "Nội dung" : undefined}
                        rules={[
                            { required: true, message: "Vui lòng nhập nội dung" },
                            {
                                min: 1,
                                message: "Nội dung không được để trống",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={isExpanded ? 4 : 1}
                            placeholder="Viết gì đó..."
                            showCount={isExpanded}
                            maxLength={1000}
                            onClick={handleTextAreaClick}
                            onFocus={() => setIsExpanded(true)}
                            autoFocus={isExpanded}
                            className={`resize-none transition-all duration-300 ${isExpanded
                                ? 'border-blue-300 focus:border-blue-500 focus:shadow-lg'
                                : 'border-gray-200 hover:border-blue-300'
                                }`}
                        />
                    </Form.Item>

                    {isExpanded && (
                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createPostMutation.isPending}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold text-base rounded-xl"
                            >
                                🚀 Đăng bài
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </div>
        </div>
    );
};

