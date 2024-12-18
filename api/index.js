import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import swaggerDocumentation from "../swagger.json" assert { type: "json" };

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.get("/swagger.json", (req, res) => {
  res.status(200).json(swaggerDocumentation);
});

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Ошибка запуска сервера:", err.message);
  });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Сервер работает" });
});

app.get("/all-posts", async (req, res) => {
  try {
    const allPost = await prisma.post.findMany();
    res.status(200).json(allPost);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/one-post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const onePost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!onePost) {
      return res.status(404).json({ error: "Нет такого ID" });
    }

    res.status(200).json(onePost);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/create", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    if (
      !title ||
      !content ||
      typeof title !== "string" ||
      typeof content !== "string"
    ) {
      return res.status(400).json({ message: "Некорректные данные" });
    }

    const newPost = await prisma.post.create({
      data: { title, content, imageUrl },
    });

    res.status(201).json({ message: "Успешно добавлено", newPost });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Нет такого ID" });
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Успешно удалено" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;

    if (
      !title ||
      !content ||
      typeof title !== "string" ||
      typeof content !== "string"
    ) {
      return res.status(400).json({ message: "Некорректные данные" });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Нет такого ID" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, imageUrl },
    });

    res.status(200).json({ message: "Успешно обновлено", updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
