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
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-base-200 shadow-xl border border-base-300 space-y-4">
            <span className="text-5xl">⚡</span>
            <h1 className="text-2xl font-extrabold">Đang khởi động Locket Xwuan</h1>
            <p className="text-sm opacity-80">
              Có thể trình duyệt cần làm mới để đồng bộ bộ nhớ đệm.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-base-300 p-3 rounded-xl overflow-x-auto text-left opacity-70">
                {this.state.error?.message || String(this.state.error)}
              </pre>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="btn btn-primary btn-sm rounded-xl font-bold"
              >
                Xóa Cache & Tải Lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline btn-sm rounded-xl"
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
