// server.js
import express from "express";
import fetch from "node-fetch";            // Node <=18; on 18+ you can use global fetch
import cors from "cors";

const app = express();
app.use(cors()); // allow your site to call this proxy

const BASE = "https://bitjita.com/api";

// Pass through search: /proxy/items?q=saw
app.get("/proxy/items", async (req, res) => {
  const url = `${BASE}/items`;
  const r = await fetch(url);
  res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(r.status);
  r.body.pipe(res);
});

app.listen(3000, () => console.log("Proxy on http://localhost:3000"));