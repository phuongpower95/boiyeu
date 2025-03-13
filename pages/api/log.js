import { google } from "googleapis";

let auth;

async function authorize() {
  try {
    console.log("Đang xác thực Google Sheets...");

    if (!auth) {
      // Sử dụng biến môi trường thay vì file credentials.json
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      const { client_email, private_key } = credentials;

      auth = new google.auth.JWT(client_email, null, private_key, [
        "https://www.googleapis.com/auth/spreadsheets",
      ]);
    }

    console.log("Xác thực thành công!");
    return auth;
  } catch (error) {
    console.error("Lỗi khi xác thực Google Sheets:", error);
    throw new Error("Lỗi xác thực Google Sheets");
  }
}
