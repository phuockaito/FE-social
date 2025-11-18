import { useEffect, useState } from "react";

interface PostMessageData {
    type: string;
    email?: string;
    [key: string]: unknown;
}

interface UsePostMessageOptions {
    allowedOrigins?: string[];
    messageType?: string;
    onMessage?: (email: string) => void;
}

/**
 * Hook to listen for postMessage from parent window (iframe)
 */
export const usePostMessage = (options: UsePostMessageOptions = {}) => {
    const {
        allowedOrigins = ["*"], // Allow all origins by default, can be restricted
        messageType = "IFRAME_RESPONSE",
        onMessage,
    } = options;

    const [email, setEmail] = useState<string>("");
    const [isFromPostMessage, setIsFromPostMessage] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent<PostMessageData>) => {
            if (
                allowedOrigins.length > 0 &&
                !allowedOrigins.includes("*") &&
                !allowedOrigins.includes(event.origin)
            ) {
                console.warn(
                    `PostMessage from unauthorized origin: ${event.origin}`
                );
                return;
            }

            // Check if message type matches
            if (event.data?.type === messageType) {
                const receivedEmail = event.data.data.email;

                if (receivedEmail && typeof receivedEmail === "string") {
                    // Validate email format
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(receivedEmail)) {
                        setEmail(receivedEmail);
                        setIsFromPostMessage(true);
                        onMessage?.(receivedEmail);

                        // Optionally send confirmation back to parent
                        if (event.source && event.source !== window) {
                            (event.source as Window).postMessage(
                                {
                                    type: "EMAIL_RECEIVED",
                                    email: receivedEmail,
                                    success: true,
                                },
                                event.origin
                            );
                        }
                    } else {
                        console.warn("Invalid email format received:", receivedEmail);
                    }
                }
            }
        };

        window.addEventListener("message", handleMessage);

        // Also listen for initial message (in case message was sent before iframe loaded)
        // Request email from parent
        if (window.parent && window.parent !== window) {
            window.parent.postMessage(
                { type: "REQUEST_EMAIL" },
                "*" // Can be restricted to specific origin
            );
        }

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [allowedOrigins, messageType, onMessage]);

    return { email, isFromPostMessage, setEmail };
};

