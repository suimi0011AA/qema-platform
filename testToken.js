import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // لو عندك .env فيه JWT_SECRET

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzYyMzU4MDY5LCJleHAiOjE3NjI0NDQ0Njl9._S7fhwhMvNc6vmfD8_myAFg1F5O4jW36GcLsbPUpP9Y"; // الصقي التوكن اللي حصلتيه من /login
const secret = process.env.JWT_SECRET || "myverystrongsecret";

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ Token is valid:", decoded);
} catch(err) {
  console.log("❌ Token error:", err.message);
}