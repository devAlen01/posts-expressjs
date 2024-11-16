# Документация Fake-Post API

Fake-Post API предоставляет интерфейс для управления постами. API позволяет создавать, читать, обновлять и удалять посты. Ознакомьтесь с документацией ниже, чтобы узнать, как использовать API.

### Описание

- **Base URL (Production):** `https://fake-posts-api.vercel.app`
- **Base URL (Development):** `http://localhost:5001`

---

## Эндпоинты API

### 1. Получить все посты

- **URL:** `/all-posts`
- **Метод:** `GET`
- **Описание:** Возвращает список всех постов.
- **Ответ:**
  - **200 OK**:
    ```json
    [
      {
        "id": 1,
        "title": "Заголовок поста",
        "content": "Содержимое поста",
        "imageUrl": "https://my-image/image.jpg"
      }
    ]
    ```

---

### 2. Получить пост по ID

- **URL:** `/one-post/{id}`
- **Метод:** `GET`
- **Описание:** Возвращает пост по заданному ID.
- **Параметры пути:**
  - `id` (integer) — ID поста.
- **Ответы:**
  - **200 OK**:
    ```json
    {
      "id": 1,
      "title": "Заголовок поста",
      "content": "Содержимое поста",
      "imageUrl": "https://example.com/image.jpg"
    }
    ```
  - **400 Bad Request**: Если пост с таким ID не найден.
    ```json
    {
      "error": "Нет такого ID"
    }
    ```

---

### 3. Создать новый пост

- **URL:** `/create`
- **Метод:** `POST`
- **Описание:** Создает новый пост.
- **Тело запроса:**
  ```json
  {
    "title": "Заголовок поста",
    "content": "Содержимое поста",
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Ответы:**
  - **201 Created**:
    ```json
    {
      "message": "Успешно добавлено",
      "newPost": {
        "title": "Заголовок поста",
        "content": "Содержимое поста",
        "imageUrl": "https://example.com/image.jpg"
      }
    }
    ```
  - **404 Not Found**: Ошибка, если не предоставлены обязательные поля (title, content).
    ```json
    {
      "message": "Ошибка при добавлении"
    }
    ```

---

### 4. Удалить пост по ID

- **URL:** `/delete/{id}`
- **Метод:** `DELETE`
- **Описание:** Удаляет пост с заданным ID.
- **Параметры пути:**
  - `id` (integer) — ID поста.
- **Ответы:**
  - **200 OK**:
    ```json
    {
      "message": "Успешно удалено"
    }
    ```
  - **400 Bad Request**: Если пост с таким ID не найден.
    ```json
    {
      "error": "Нет такого ID"
    }
    ```

---

### 5. Обновить пост по ID

- **URL:** `/update/{id}`
- **Метод:** `PUT`
- **Описание:** Обновляет данные поста с заданным ID.
- **Параметры пути:**
  - `id` (integer) — ID поста.
- **Тело запроса:**
  ```json
  {
    "title": "Обновленный заголовок поста",
    "content": "Обновленное содержимое поста",
    "imageUrl": "https://updated-image.jpg"
  }
  ```
- **Ответы:**
  - **201 Created**:
    ```json
    {
      "message": "Успешно обновлено"
    }
    ```
  - **400 Bad Request**: Если пост с таким ID не найден.
    ```json
    {
      "error": "Нет такого ID"
    }
    ```
  - **404 Not Found**: Ошибка, если не предоставлены обязательные поля (title, content).
    ```json
    {
      "message": "Ошибка при добавлении"
    }
    ```

---

## Пример запроса

### Пример создания нового поста:

```bash
curl -X POST https://fake-posts-api.vercel.app/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новый пост",
    "content": "Это содержимое нового поста",
    "imageUrl": "https://example.com/image.jpg"
  }'
```
