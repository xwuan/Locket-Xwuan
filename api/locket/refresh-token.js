const LOCKET_FIREBASE_KEY = "AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ error: { status: 400, message: "Missing refreshToken" } });
  }

  try {
    const googleRes = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${LOCKET_FIREBASE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }
    );

    const data = await googleRes.json();
    if (!googleRes.ok || data.error) {
      return res.status(401).json({ error: { status: 401, message: "Refresh token expired" } });
    }

    return res.status(200).json({
      success: true,
      data: {
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        localId: data.user_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: { status: 500, message: "Token refresh failed" } });
  }
}
