import express from "express"
import prisma from "./prisma/prisma"

const app = express()
app.use(express.json())

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (e) {
    res.status(500).json({ error: "Internal server error" })
  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})