import React from "react";
import Home from "../pages/Public/Home";
import Login from "../pages/Public/Login";
import { CONFIG } from "@/config";

const NewsPage = React.lazy(() => import("@/pages/Public/NewsPage"));
const NewsDetailPage = React.lazy(() => import("@/pages/Public/NewsDetailPage"));
const ForgotPassword = React.lazy(() => import("@/pages/Public/ForgotPassword"));
const DonatePage = React.lazy(() => import("@/pages/Public/Sponsors"));
const AboutLocketXwuan = React.lazy(() => import("../pages/Public/About"));
const AboutMe = React.lazy(() => import("../pages/Auth/AboutMe"));
const Timeline = React.lazy(() => import("../pages/Public/Timeline"));
const Docs = React.lazy(() => import("../pages/Public/Docs"));
const CollectionPage = React.lazy(() => import("@/pages/Public/CollectionPage"));
const Contact = React.lazy(() => import("../pages/Public/Contact"));
const PrivacyPolicy = React.lazy(() => import("../pages/Public/PrivacyPolicy"));
const PricingPage = React.lazy(() => import("../pages/Public/Pricing"));
const PlanDetailPage = React.lazy(() => import("../pages/Auth/PricingDetail"));
const ToolsLocket = React.lazy(() => import("../pages/Auth/LocketXwuanTools"));
const Settings = React.lazy(() => import("../pages/Public/Settings"));
const DevPage = React.lazy(() => import("../pages/Public/DevPage"));
const AddToHomeScreenGuide = React.lazy(() => import("../pages/Public/AddToScreen"));
const ErrorReferencePage = React.lazy(() => import("../pages/Public/ErrorReferencePage"));
const ReferencePage = React.lazy(() => import("../pages/Public/APIDocs"));
const BirthdayPage = React.lazy(() => import("../pages/Public/BirthdayPage"));

// New Routes
const CaptionKanadePage = React.lazy(() => import("@/pages/Public/Collab/CaptionKanade"));
const LocketUploadCollabPage = React.lazy(() => import("@/pages/Public/Collab/LocketUpload"));
const TermsPage = React.lazy(() => import("@/pages/Public/Terms"));

const APP_NAME = CONFIG.app.fullName;

export const publicRoutes = [
  { path: "/", component: Home, title: `Trang Chủ | ${APP_NAME}` },
  { path: "/login", component: Login, title: `Đăng Nhập | ${APP_NAME}` },

  { path: "/about", component: AboutLocketXwuan, title: `Về Website Locket Xwuan | ${APP_NAME}` },
  { path: "/about-xwuan", component: AboutMe, title: `Về Xwuan | ${APP_NAME}` },

  { path: "/newsfeed", component: NewsPage, title: `Bảng tin | ${APP_NAME}` },
  { path: "/newsfeed/:slug", component: NewsDetailPage, title: `Bảng tin | ${APP_NAME}` },
  
  { path: "/download", component: AddToHomeScreenGuide, title: `Thêm ứng dụng vào màn hình chính | ${APP_NAME}` },
  { path: "/timeline", component: Timeline, title: `Dòng Thời Gian | ${APP_NAME}` },

  { path: "/docs", component: Docs, title: `Tài liệu | ${APP_NAME}` },
  { path: "/sponsors", component: DonatePage, title: `Ủng hộ dự án | ${APP_NAME}` },
  { path: "/collection", component: CollectionPage, title: `Thư viện phiên bản | ${APP_NAME}` },
  { path: "/privacy", component: PrivacyPolicy, title: `Chính sách riêng tư | ${APP_NAME}` },
  { path: "/terms", component: TermsPage, title: `Điều khoản sử dụng | ${APP_NAME}` },
  { path: "/pricing", component: PricingPage, title: `Đăng ký gói thành viên | ${APP_NAME}` },
  { path: "/pricing/:planId", component: PlanDetailPage, title: `Chi tiết gói | ${APP_NAME}` },
  { path: "/locket-xwuan-tools", component: ToolsLocket, title: `Công cụ mở rộng | ${APP_NAME}` },

  // Collab Pages
  { path: "/collab/caption-kanade", component: CaptionKanadePage, title: `Web hợp tác Caption Kanade | ${APP_NAME}` },
  { path: "/collab/locket-upload", component: LocketUploadCollabPage, title: `Web hợp tác Locket Upload | ${APP_NAME}` },

  { path: "/settings", component: Settings, title: `Cài đặt | ${APP_NAME}` },
  { path: "/devpage", component: DevPage, title: `Dev Page | ${APP_NAME}` },
  { path: "/reference", component: ReferencePage, title: `API Docs | ${APP_NAME}` },
  { path: "/incidents", component: ErrorReferencePage, title: `Trung tâm sự cố | ${APP_NAME}` },
  { path: "/contact", component: Contact, title: `Liên hệ & Hỗ trợ | ${APP_NAME}` },

  { path: "/happy-birthday", component: BirthdayPage, title: `Chúc mừng sinh nhật Xwuan | ${APP_NAME}` },
  { path: "/forgot-password", component: ForgotPassword, title: `Khôi phục mật khẩu | ${APP_NAME}` },
];
