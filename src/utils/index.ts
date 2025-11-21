import { jwtVerify } from "jose";

export function pemToBinary(pem: string) {
    const b64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\s+/g, "");
    const binary = atob(b64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return array.buffer;
}

export async function verifyToken(token: string) {
    try {
        const publicKey = await crypto.subtle.importKey(
            "spki",
            pemToBinary(import.meta.env.VITE_APP_PUBLIC_KEY),
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
            false,
            ["verify"]
        );
        const { payload } = await jwtVerify(token, publicKey);
        return  payload;
    } catch  {
        return null;
    }
}