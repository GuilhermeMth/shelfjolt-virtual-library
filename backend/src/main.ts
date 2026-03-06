import "dotenv/config";
import { initializeFirebaseAdmin } from "./providers/firebaseAdmin";
import serviceAccount from "../serviceAccount.json";
import express from "express";
import cors from "cors";
import router from "./routes";
import path from "path";
import { globalLimiter } from "./middleware/rateLimit.middleware";

const origin = process.env.FRONTEND_URL;
const port = Number(process.env.API_PORT);

const app = express();
initializeFirebaseAdmin(serviceAccount);

// Enable trust proxy to get correct IP addresses behind proxies
app.set("trust proxy", 1);

app.use(
  cors({
    origin: `${origin}`,
    credentials: true,
  }),
);
app.use(express.json());

// Apply global rate limiting to all routes
app.use(globalLimiter);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", router);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
