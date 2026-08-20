const LOCKET_FIREBASE_KEY = "AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So";
const IOS_BUNDLE_ID = "com.locket.Locket";

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key, x-app-author, x-app-name, x-app-client, x-app-api, x-app-env"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: { status: 405, message: "Method Not Allowed" } });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: { status: 400, message: "Vui lòng nhập đầy đủ email và mật khẩu." }
    });
  }

  try {
    // 1. Authenticate with Locket Firebase Auth backend
    const googleResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${LOCKET_FIREBASE_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await googleResponse.json();

    if (!googleResponse.ok || data.error) {
      const errorMsg = data.error?.message || "Đăng nhập thất bại";
      let userFriendlyMsg = "Tài khoản hoặc mật khẩu không đúng!";
      let status = 400;

      if (errorMsg === "EMAIL_NOT_FOUND" || errorMsg === "INVALID_PASSWORD" || errorMsg === "INVALID_LOGIN_CREDENTIALS") {
        userFriendlyMsg = "Tài khoản hoặc mật khẩu không đúng!";
      } else if (errorMsg === "USER_DISABLED") {
        userFriendlyMsg = "Tài khoản Locket này đã bị vô hiệu hóa.";
        status = 403;
      } else if (errorMsg === "TOO_MANY_ATTEMPTS_TRY_LATER") {
        userFriendlyMsg = "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút!";
        status = 429;
      }

      return res.status(status).json({
        error: { status, message: userFriendlyMsg }
      });
    }

    // 2. Fetch extended user profile if available
    let userInfo = {
      localId: data.localId,
      email: data.email,
      displayName: data.displayName || data.email?.split("@")[0] || "Người dùng Locket",
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      profilePicture: data.profilePicture || null,
    };

    try {
      const accountRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${LOCKET_FIREBASE_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Ios-Bundle-Identifier": IOS_BUNDLE_ID,
          },
          body: JSON.stringify({ idToken: data.idToken }),
        }
      );
      const accountData = await accountRes.json();
      if (accountData?.users?.[0]) {
        const u = accountData.users[0];
        userInfo.displayName = u.displayName || userInfo.displayName;
        userInfo.photoUrl = u.photoUrl || userInfo.profilePicture;
        userInfo.profilePicture = u.photoUrl || userInfo.profilePicture;
      }
    } catch (e) {
      console.warn("Could not fetch extended account info:", e);
    }

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      data: userInfo,
    });
  } catch (error) {
    console.error("Login serverless function error:", error);
    return res.status(500).json({
      error: { status: 500, message: "Lỗi kết nối máy chủ, vui lòng thử lại sau!" }
    });
  }
}
