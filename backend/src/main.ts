import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const port = Number(process.env.API_PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
