import { tool } from "@langchain/core/tools";
import { google } from "googleapis";
import { z } from "zod";

// Initialize Google Sheets API
const getSheetsClient = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  
  if (!email || !privateKey) {
    console.warn("Google Sheets credentials not set (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)");
    return null;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
};

export const getGoogleSheetTool = () => {
  return tool(
    async ({ query }) => {
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

        // Simple search logic: Filter rows that contain the query keywords
        // Assuming the first row is the header
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

        // Format the output
        const formattedResults = matchingRows.map((row) => {
          return header.map((col, index) => `${col}: ${row[index] || ""}`).join(", ");
        });

        return `Found the following matching data in Google Sheets:\n\n${formattedResults.join("\n")}`;

      } catch (error: any) {
        console.error("Google Sheets API Error:", error);
        return `Error accessing Google Sheets: ${error.message}`;
      }
    },
    {
      name: "google_sheets_search",
      description: "Search for information in the connected Google Sheet. Use this to answer questions based on the user's private data.",
      schema: z.object({
        query: z.string().describe("The search query to find matching rows in the sheet"),
      }),
    }
  );
};
