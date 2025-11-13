import { useState } from "react";
import { Input, Button, Form, message, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface UserEmailInputProps {
    value?: string;
    onChange: (email: string) => void;
}

export const UserEmailInput = ({
    value,
    onChange,
}: UserEmailInputProps) => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState(value || "");

    const handleSubmit = (values: { email: string }) => {
        const emailValue = values.email.trim();
        if (!emailValue) {
            message.warning("Vui lòng nhập email");
            return;
        }
        setEmail(emailValue);
        onChange(emailValue);
        message.success(`Đã đặt email: ${emailValue}`);
    };

    const handleClear = () => {
        setEmail("");
        onChange("");
        form.resetFields();
        message.info("Đã xóa email");
    };

    return (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <Form
                form={form}
                layout="inline"
                onFinish={handleSubmit}
                className="w-full"
                initialValues={{ email: value }}
            >
                <Form.Item
                    name="email"
                    className="flex-1 mb-0"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập email của bạn (vd: user@example.com)"
                        size="large"
                        className="w-full"
                    />
                </Form.Item>
                <Space className="ml-2">
                    <Button type="primary" htmlType="submit" size="large">
                        Xác nhận
                    </Button>
                    {email && (
                        <Button onClick={handleClear} size="large">
                            Xóa
                        </Button>
                    )}
                </Space>
            </Form>
            {email && (
                <div className="mt-2 text-sm text-gray-600">
                    Email hiện tại: <strong>{email}</strong>
                </div>
            )}
        </div>
    );
};

