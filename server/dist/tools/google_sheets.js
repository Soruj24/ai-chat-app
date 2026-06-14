"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleSheetTool = void 0;
const tools_1 = require("@langchain/core/tools");
const googleapis_1 = require("googleapis");
const zod_1 = require("zod");
const getSheetsClient = () => {
    var _a;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (_a = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n");
    if (!email || !privateKey) {
        console.warn("Google Sheets credentials not set (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)");
        return null;
    }
    const auth = new googleapis_1.google.auth.JWT({
        email,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    return googleapis_1.google.sheets({ version: "v4", auth });
};
const getGoogleSheetTool = () => {
    return (0, tools_1.tool)(async ({ query }) => {
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
        const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1";
        if (!spreadsheetId) {
            return "Error: GOOGLE_SHEETS_SPREADSHEET_ID not set in environment variables.";
        }
        const sheets = getSheetsClient();
        if (!sheets) {
            return "Error: Google Service Account credentials not set.";
        }
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                return "No data found in the Google Sheet.";
            }
            const header = rows[0];
            const dataRows = rows.slice(1);
            const lowerQuery = query.toLowerCase();
            const matchingRows = dataRows.filter((row) => {
                const rowString = row.join(" ").toLowerCase();
                return rowString.includes(lowerQuery);
            });
            if (matchingRows.length === 0) {
                return "No matching data found in the Google Sheet for your query.";
            }
            const formattedResults = matchingRows.map((row) => {
                return header.map((col, index) => `${col}: ${row[index] || ""}`).join(", ");
            });
            return `Found the following matching data in Google Sheets:\n\n${formattedResults.join("\n")}`;
        }
        catch (error) {
            console.error("Google Sheets API Error:", error);
            return `Error accessing Google Sheets: ${error.message}`;
        }
    }, {
        name: "google_sheets_search",
        description: "Search for information in the connected Google Sheet. Use this to answer questions based on the user's private data.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("The search query to find matching rows in the sheet"),
        }),
    });
};
exports.getGoogleSheetTool = getGoogleSheetTool;
//# sourceMappingURL=google_sheets.js.map