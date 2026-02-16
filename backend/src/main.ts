import express from "express";
import router from "./routes";

const app = express();
app.use(express.json());
app.use("/api", router);

const port = process.env.API_PORT!;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
