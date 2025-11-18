import { useState } from "react";
import { usePostMessage } from "./usePostMessage";

/**
 * Custom hook to manage user email from postMessage
 */
export const useUserEmail = () => {
    const [userEmail, setUserEmail] = useState<string>("");

    usePostMessage({
        messageType: "IFRAME_RESPONSE",
        onMessage: (email) => {
            setUserEmail(email);
        },
    });

    return userEmail;
};

