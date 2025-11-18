# Mini App - Frontend

Ứng dụng web hiện đại để đăng bài viết và tương tác với cộng đồng thông qua tính năng like/dislike. Được thiết kế để nhúng trong iframe và nhận email từ parent window qua postMessage.

## 🚀 Tính năng

### ✨ Tính năng chính

-   **Đăng bài viết**: Tạo và chia sẻ bài viết với giao diện hiện đại
-   **Like/Dislike**: Tương tác với bài viết bằng like và dislike
-   **Lịch sử Reactions**: Xem lại các bài viết đã like/dislike
-   **Pagination**: Phân trang cho danh sách bài viết
-   **Real-time Updates**: Cập nhật dữ liệu tự động sau mỗi thao tác

### 🎨 UI/UX Features

-   **Modern Design**: Gradient backgrounds, glass morphism effects
-   **Responsive**: Tối ưu cho mọi kích thước màn hình
-   **Smooth Animations**: Transitions và hover effects mượt mà
-   **Bottom Navigation**: Menu điều hướng cố định ở dưới màn hình
-   **Sticky Form**: Form tạo bài viết sticky ở đầu trang với collapse/expand
-   **Auto-collapse**: Form tự động thu gọn sau khi đăng bài thành công

### 🔐 Integration

-   **PostMessage Support**: Nhận email từ parent window (iframe)
-   **Email Validation**: Validate email format tự động
-   **Secure Communication**: Hỗ trợ origin validation cho postMessage

## 🛠️ Công nghệ sử dụng

### Core

-   **React 19**: UI framework
-   **TypeScript**: Type safety
-   **Vite**: Build tool và dev server

### UI Libraries

-   **Ant Design 5**: Component library với locale tiếng Việt
-   **TailwindCSS 4**: Utility-first CSS framework
-   **Ant Design Icons**: Icon library

### State Management & Data Fetching

-   **TanStack Query (React Query)**: Server state management và caching
-   **React Router 7**: Client-side routing

### HTTP Client

-   **Axios**: HTTP client với interceptors
-   **query-string**: URL parameter serialization

### Utilities

-   **Day.js**: Date formatting với locale tiếng Việt
-   **clsx**: Conditional class names

## 📁 Cấu trúc thư mục

```
FE/
├── src/
│   ├── api/                    # API layer
│   │   ├── axios-client.ts    # Axios configuration
│   │   └── index.ts            # API functions và types
│   ├── assets/                 # Static assets
│   ├── components/            # React components
│   │   ├── BottomNavbar.tsx   # Bottom navigation bar
│   │   ├── CreatePostForm.tsx # Form tạo bài viết
│   │   ├── PostCard.tsx       # Card hiển thị bài viết
│   │   ├── PostList.tsx       # Danh sách bài viết
│   │   ├── MyReactionsList.tsx # Danh sách reactions
│   │   └── UserEmailInput.tsx # Input email (deprecated)
│   ├── hooks/                  # Custom React hooks
│   │   ├── usePostMessage.ts  # Hook nhận postMessage từ iframe
│   │   └── useUserEmail.ts    # Hook quản lý user email
│   ├── pages/                  # Page components
│   │   ├── index/              # Trang chủ
│   │   └── my-reactions/       # Trang lịch sử reactions
│   ├── routes/                 # Route configuration
│   │   └── index.tsx           # Router setup
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── public/                     # Public assets
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Documentation
```

## 🚀 Cài đặt và Chạy

### Yêu cầu

-   Node.js 18+
-   pnpm (hoặc npm/yarn)

### Cài đặt dependencies

```bash
cd FE
pnpm install
```

### Cấu hình môi trường

Tạo file `.env` trong thư mục `FE`:

```env
VITE_APP_URL_API=http://localhost:3000
```

### Chạy development server

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build production

```bash
pnpm build
```

Output sẽ được tạo trong thư mục `dist/`

### Preview production build

```bash
pnpm preview
```

## 📡 API Integration

### Base URL

API được proxy qua `/api` và rewrite về backend server được cấu hình trong `vite.config.ts`.

### Endpoints được sử dụng

| Method | Endpoint               | Mô tả                                 |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/posts`               | Lấy danh sách bài viết với pagination |
| GET    | `/posts/:id`           | Lấy chi tiết một bài viết             |
| POST   | `/posts`               | Tạo bài viết mới                      |
| POST   | `/posts/:id/like`      | Like một bài viết                     |
| POST   | `/posts/:id/dislike`   | Dislike một bài viết                  |
| GET    | `/posts/my-reactions`  | Lấy lịch sử reactions của user        |
| GET    | `/posts/:id/reactions` | Xem chi tiết reactions của bài viết   |

### API Client

File `src/api/index.ts` chứa tất cả các API functions với TypeScript types:

```typescript
import { postApi } from "./api";

// Lấy danh sách posts
const posts = await postApi.getPosts({
    email: "user@example.com",
    page: 1,
    limit: 10,
});

// Tạo post mới
const newPost = await postApi.createPost({
    email: "user@example.com",
    content: "Nội dung bài viết",
});

// Like post
await postApi.likePost(postId, "user@example.com");
```

## 🎣 Custom Hooks

### usePostMessage

Hook để nhận email từ parent window qua postMessage:

```typescript
import { usePostMessage } from "./hooks/usePostMessage";

usePostMessage({
    messageType: "IFRAME_RESPONSE",
    allowedOrigins: ["https://yourdomain.com"], // Optional
    onMessage: (email) => {
        console.log("Email received:", email);
    },
});
```

### useUserEmail

Hook đơn giản để quản lý user email:

```typescript
import { useUserEmail } from "./hooks/useUserEmail";

const userEmail = useUserEmail(); // Tự động nhận từ postMessage
```

## 🧩 Components

### BottomNavbar

Menu điều hướng cố định ở dưới màn hình với 2 menu items:

-   Trang chủ
-   Lịch sử Reactions

### CreatePostForm

Form tạo bài viết với các tính năng:

-   Sticky ở đầu trang
-   Collapse/Expand
-   Auto-collapse sau khi đăng thành công
-   Click outside để collapse

### PostCard

Card hiển thị bài viết với:

-   Thông tin tác giả và thời gian
-   Nội dung bài viết
-   Like/Dislike buttons với số lượng
-   Highlight reaction của user hiện tại
-   Memoized để tối ưu performance

### PostList

Danh sách bài viết với:

-   Loading states
-   Error handling
-   Pagination
-   Empty states

### MyReactionsList

Danh sách reactions với tabs:

-   Tab "Đã Like"
-   Tab "Đã Dislike"
-   Stats hiển thị tổng số
-   Pagination

## 🎨 Styling

### TailwindCSS

Sử dụng TailwindCSS 4 với utility classes cho styling.

### Custom CSS

File `src/index.css` chứa:

-   Custom message styles (success, error, warning)
-   Ant Design message container styling
-   Global styles

### Design System

-   **Colors**: Blue → Indigo → Purple gradient theme
-   **Shadows**: Layered shadows cho depth
-   **Border Radius**: Rounded corners (rounded-xl, rounded-2xl)
-   **Transitions**: Smooth animations (duration-200, duration-300)

## 🔄 State Management

### React Query

Sử dụng TanStack Query để quản lý server state:

-   Automatic caching
-   Background refetching
-   Optimistic updates
-   Error handling

### Local State

Sử dụng React hooks (`useState`, `useRef`) cho local component state.

## 📱 Routes

| Path            | Component       | Mô tả                            |
| --------------- | --------------- | -------------------------------- |
| `/`             | HomePage        | Trang chủ với danh sách bài viết |
| `/my-reactions` | MyReactionsPage | Trang lịch sử reactions          |

## 🔧 Configuration

### Vite Config

-   **Port**: 3000
-   **Proxy**: `/api` → `VITE_APP_URL_API`
-   **Alias**: `@` → `src/`
-   **Plugins**: React, TailwindCSS

### React Query Config

-   **staleTime**: 2000ms
-   **refetchInterval**: 15 phút
-   **retry**: 0 (không retry tự động)
-   **placeholderData**: keepPreviousData

## 🐛 Development

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
tsc --noEmit
```

## 📦 Build & Deploy

### Build

```bash
pnpm build
```

### Environment Variables

Đảm bảo set `VITE_APP_URL_API` trong production environment.

### Deploy

Có thể deploy lên:

-   Vercel
-   Netlify
-   GitHub Pages
-   Bất kỳ static hosting nào

## 🔐 Security

### PostMessage

-   Hỗ trợ origin validation
-   Email format validation
-   Secure communication với parent window

### API

-   Proxy qua Vite dev server trong development
-   CORS được xử lý bởi backend

## 📝 Notes

-   Email được nhận tự động từ parent window qua postMessage
-   Form tạo bài viết tự động collapse sau khi đăng thành công
-   Bottom navbar luôn hiển thị ở dưới màn hình
-   Tất cả timestamps được format bằng tiếng Việt (dayjs locale)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

ISC
