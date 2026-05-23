import express from "express";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});