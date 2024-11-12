import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  const allPost = await prisma.post.findMany();
  const findIndex = allPost.findIndex((el) => el.id === +id);

  if (findIndex === -1) {
    return res.status(400).json({ error: "Нет такого ID" });
  }

  const onePost = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

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
  const allPost = await prisma.post.findMany();
  const findIndex = allPost.findIndex((el) => el.id === +id);

  if (findIndex === -1) {
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
  const allPost = await prisma.post.findMany();
  const findIndex = allPost.findIndex((el) => el.id === +id);
  if (findIndex === -1) {
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
