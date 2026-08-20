import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#0f172a",
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              backgroundColor: "#1e293b",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              border: "1px solid #334155",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0", color: "#ffffff" }}>
              Đang khởi động Locket Xwuan
            </h1>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 16px 0" }}>
              Trình duyệt đang cập nhật dữ liệu phiên bản mới.
            </p>
            {this.state.error && (
              <pre
                style={{
                  fontSize: "12px",
                  backgroundColor: "#090d16",
                  color: "#ef4444",
                  padding: "12px",
                  borderRadius: "12px",
                  overflowX: "auto",
                  textAlign: "left",
                  margin: "0 0 20px 0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error?.message || String(this.state.error)}
              </pre>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.href = "/";
                }}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Xóa Cache & Tải Lại
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: "transparent",
                  color: "#94a3b8",
                  border: "1px solid #475569",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Tải Lại Trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
