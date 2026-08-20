import React from "react";
import { ShieldCheck, FileText, Lock, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-base-100 rounded-3xl p-6 md:p-10 shadow-xl border border-base-300">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-base-300">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Điều Khoản Sử Dụng</h1>
            <p className="text-sm text-base-content/60">Cập nhật lần cuối: Tháng 8/2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm md:text-base leading-relaxed text-base-content/80">
          <section>
            <h2 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
              1. Chấp thuận các điều khoản
            </h2>
            <p>
              Bằng việc truy cập hoặc sử dụng ứng dụng Locket Xwuan, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
              2. Quyền riêng tư & Bảo mật
            </h2>
            <p>
              Chúng tôi cam kết tôn trọng quyền riêng tư của người dùng. Dữ liệu tài khoản, hình ảnh và video của bạn được lưu trữ an toàn và chỉ chia sẻ với những người bạn do bạn lựa chọn. Chúng tôi không bán dữ liệu người dùng cho bên thứ ba.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
              3. Quy tắc ứng xử và sử dụng
            </h2>
            <p>
              Người dùng cam kết không sử dụng nền tảng để đăng tải các nội dung vi phạm pháp luật, quấy rối, bạo lực hoặc xâm phạm quyền riêng tư của người khác. Chúng tôi có quyền khóa hoặc chấm dứt quyền truy cập nếu phát hiện vi phạm.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
              4. Giới hạn trách nhiệm
            </h2>
            <p>
              Locket Xwuan là một nền tảng mở rộng độc lập và không liên kết trực tiếp chính thức với Locket Camera Inc. Dịch vụ được cung cấp "nguyên trạng" nhằm nâng cao trải nghiệm người dùng.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
