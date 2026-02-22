import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";

const origin = process.env.FRONTEND_URL;
const port = Number(process.env.API_PORT);

const app = express();
app.use(
  cors({
    origin: `${origin}`,
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", router);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
