import { RouterProvider } from "react-router";

import { keepPreviousData, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";

import { ROOT_ROUTER } from "./routes";
import viVN from "antd/locale/vi_VN";

import "dayjs/locale/vi";
import "./index.css";
import "@ant-design/v5-patch-for-react-19";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: 1000 * 60 * 15,
            staleTime: 2000,
            retry: 0,
            placeholderData: keepPreviousData,
        },
        mutations: {
            retry: 0,
            networkMode: "online",
        },
    },
});



createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <ConfigProvider
            locale={viVN}
        >
            <RouterProvider router={ROOT_ROUTER} />
        </ConfigProvider>
    </QueryClientProvider >
);
