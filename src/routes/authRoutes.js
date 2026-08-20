import { CONFIG } from "@/config";
import React from "react";

const AboutLocketXwuan = React.lazy(() => import("../pages/Public/About"));
const RestoreStreak = React.lazy(() => import("@/pages/Auth/RestoreStreak"));
const NewsPage = React.lazy(() => import("@/pages/Public/NewsPage"));
const NewsDetailPage = React.lazy(() => import("@/pages/Public/NewsDetailPage"));
const AuthHome = React.lazy(() => import("../pages/Auth/Home"));
const Profile = React.lazy(() => import("../pages/Auth/Profile"));
const DonatePage = React.lazy(() => import("@/pages/Public/Sponsors"));
const PostMoments = React.lazy(() => import("../pages/Auth/PostMoments"));
const AboutMe = React.lazy(() => import("../pages/Auth/AboutMe"));
const Docs = React.lazy(() => import("../pages/Public/Docs"));
const Settings = React.lazy(() => import("../pages/Public/Settings"));
const DevPage = React.lazy(() => import("../pages/Public/DevPage"));
const AddToHomeScreenGuide = React.lazy(() => import("../pages/Public/AddToScreen"));
const PricingPage = React.lazy(() => import("../pages/Public/Pricing"));
const PlanDetailPage = React.lazy(() => import("../pages/Auth/PricingDetail"));
const PayPage = React.lazy(() => import("../pages/Auth/PayPage"));
const Timeline = React.lazy(() => import("../pages/Public/Timeline"));
const ToolsLocket = React.lazy(() => import("../pages/Auth/LocketXwuanTools"));
const ManageCaption = React.lazy(() => import("@/pages/Public/ManageCaption"));
const ErrorReferencePage = React.lazy(() => import("../pages/Public/ErrorReferencePage"));
const Contact = React.lazy(() => import("../pages/Public/Contact"));
const PrivacyPolicy = React.lazy(() => import("../pages/Public/PrivacyPolicy"));
const BirthdayPage = React.lazy(() => import("../pages/Public/BirthdayPage"));

// New Routes
const DiaryPage = React.lazy(() => import("@/pages/Auth/Diary"));
const FriendsPage = React.lazy(() => import("@/pages/Auth/Friends"));
const ChatPage = React.lazy(() => import("@/pages/Auth/Chat"));
const CaptionKanadePage = React.lazy(() => import("@/pages/Public/Collab/CaptionKanade"));
const LocketUploadCollabPage = React.lazy(() => import("@/pages/Public/Collab/LocketUpload"));
const TermsPage = React.lazy(() => import("@/pages/Public/Terms"));

const APP_NAME = CONFIG.app.fullName;

export const authRoutes = [
  { path: "/home", component: AuthHome, title: `Trang chủ | ${APP_NAME}` },
  { path: "/about", component: AboutLocketXwuan, title: `Về Website Locket Xwuan | ${APP_NAME}` },
  { path: "/about-xwuan", component: AboutMe, title: `Về Xwuan | ${APP_NAME}` },
  { path: "/timeline", component: Timeline, title: `Dòng Thời Gian | ${APP_NAME}` },
  { path: "/sponsors", component: DonatePage, title: `Ủng hộ dự án | ${APP_NAME}` },

  { path: "/newsfeed", component: NewsPage, title: `Bảng tin | ${APP_NAME}` },
  { path: "/newsfeed/:slug", component: NewsDetailPage, title: `Bảng tin | ${APP_NAME}` },

  { path: "/download", component: AddToHomeScreenGuide, title: `Thêm ứng dụng vào màn hình chính | ${APP_NAME}` },

  { path: "/pricing", component: PricingPage, title: `Bảng giá & Gói dịch vụ | ${APP_NAME}` },
  { path: "/pricing/:planId", component: PlanDetailPage, title: `Chi tiết gói | ${APP_NAME}` },
  { path: "/pay", component: PayPage, title: `Thanh toán | ${APP_NAME}` },

  { path: "/profile", component: Profile, title: `Hồ sơ | ${APP_NAME}` },
  { path: "/postmoments", component: PostMoments, title: `Đăng Moment Mới | ${APP_NAME}` },
  { path: "/restore-streak", component: RestoreStreak, title: `Khôi phục chuỗi Locket | ${APP_NAME}` },
  { path: "/friends", component: FriendsPage, title: `Bạn bè Locket | ${APP_NAME}` },
  { path: "/diary", component: DiaryPage, title: `Nhật ký Locket | ${APP_NAME}` },
  { path: "/chat", component: ChatPage, title: `Tin nhắn Locket | ${APP_NAME}` },
  { path: "/messages", component: ChatPage, title: `Tin nhắn Locket | ${APP_NAME}` },
  { path: "/tools", component: ToolsLocket, title: `Công cụ mở rộng | ${APP_NAME}` },
  { path: "/manage", component: ManageCaption, title: `Quản lý Caption | ${APP_NAME}` },

  // Collab Pages
  { path: "/collab/caption-kanade", component: CaptionKanadePage, title: `Web hợp tác Caption Kanade | ${APP_NAME}` },
  { path: "/collab/locket-upload", component: LocketUploadCollabPage, title: `Web hợp tác Locket Upload | ${APP_NAME}` },

  { path: "/settings", component: Settings, title: `Cài đặt | ${APP_NAME}` },
  { path: "/devpage", component: DevPage, title: `Dev Page | ${APP_NAME}` },
  { path: "/contact", component: Contact, title: `Liên hệ & Hỗ trợ | ${APP_NAME}` },
  { path: "/incidents", component: ErrorReferencePage, title: `Trung tâm sự cố | ${APP_NAME}` },
  { path: "/privacy", component: PrivacyPolicy, title: `Chính sách bảo mật | ${APP_NAME}` },
  { path: "/terms", component: TermsPage, title: `Điều khoản sử dụng | ${APP_NAME}` },
  { path: "/docs", component: Docs, title: `Tài liệu | ${APP_NAME}` },

  { path: "/happy-birthday", component: BirthdayPage, title: `Chúc mừng sinh nhật Xwuan | ${APP_NAME}` },
];
