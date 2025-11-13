import { createBrowserRouter } from "react-router";
import { HomePage } from "../pages/index";
import { MyReactionsPage } from "../pages/my-reactions";

export const ROOT_ROUTER = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/my-reactions",
        element: <MyReactionsPage />,
    },
])
