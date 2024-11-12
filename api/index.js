import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.use(cors());

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Подключение Swagger UI
const swaggerDocumentation = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "swagger.json"), "utf8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Сервер работает" });
});

app.get("/all-posts", async (req, res) => {
  const allPost = await prisma.post.findMany();
  res.status(200).json(allPost);
});

app.get("/one-post/:id", async (req, res) => {
  const { id } = req.params;
  const onePost = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!onePost) {
    return res.status(400).json({ error: "Нет такого ID" });
  }

  res.status(200).json(onePost);
});

app.post("/create", async (req, res) => {
  const { title, content, imageUrl } = req.body;
  if (!title || !content) {
    return res.status(404).json({ message: "Ошибка при добавлении" });
  }
  const newPost = {
    title,
    content,
    imageUrl,
  };
  await prisma.post.create({
    data: newPost,
  });
  res.status(201).json({ message: "Успешно добавлено", newPost });
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    return res.status(400).json({ error: "Нет такого ID" });
  }

  await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.status(200).json({ message: "Успешно удалено" });
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl } = req.body;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    return res.status(400).json({ error: "Нет такого ID" });
  } else if (!title || !content) {
    return res.status(404).json({ message: "Ошибка при добавлении" });
  }

  const updatedPost = {
    title,
    content,
    imageUrl,
  };
  await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: updatedPost,
  });
  res.status(201).json({ message: "Успешно обновлено" });
});
