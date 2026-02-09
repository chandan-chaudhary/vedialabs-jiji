import express from "express";
import authRoutes from "./routes/auth/auth.route.js";
import jijiRoutes from "./routes/execute-query/jiji.route.js";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Health Check: Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jiji", jijiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  process.exit(0);
});
