import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { dbQuery, dbRun } from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = "SUPER_SECRET_KEY_SHORTY_URL_2026";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://alex-lab-3.netlify.app",
      "https://lab-3-kv1r.onrender.com",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

let guestLinks = [];
const GUEST_LIMIT = 5;
const ITEMS_PER_PAGE = 5;

const decodeUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

app.get("/r/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const dbResult = await dbQuery(
      "SELECT long_url FROM links WHERE short_code = ?",
      [code],
    );
    if (dbResult.length > 0) {
      return res.redirect(dbResult[0].long_url);
    }

    const guestLink = guestLinks.find((l) => l.short_code === code);
    if (guestLink) {
      return res.redirect(guestLink.long_url);
    }

    return res.status(404).send("<h1>Посилання не знайдено</h1>");
  } catch (error) {
    return res.status(500).send("Помилка сервера");
  }
});

app.get("/api/links", decodeUser, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const host = req.get("host");
  const protocol = req.protocol;
  const baseRedirectUrl = `${protocol}://${host}/r/`;

  if (req.user) {
    try {
      const countResult = await dbQuery(
        "SELECT COUNT(*) as total FROM links WHERE user_id = ?",
        [req.user.userId],
      );
      const totalCount = countResult[0].total;

      const data = await dbQuery(
        `SELECT id, long_url as long, ('${baseRedirectUrl}' || short_code) as short FROM links WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
        [req.user.userId, ITEMS_PER_PAGE, offset],
      );

      return res.json({
        data,
        totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        canAddMore: true,
      });
    } catch (e) {
      return res.status(500).json({ error: "Помилка БД" });
    }
  } else {
    const totalCount = guestLinks.length;
    const paginatedData = guestLinks
      .slice(offset, offset + ITEMS_PER_PAGE)
      .map((l) => ({
        id: l.id,
        long: l.long_url,
        short: `${baseRedirectUrl}${l.short_code}`,
      }));

    return res.json({
      data: paginatedData,
      totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      canAddMore: totalCount < GUEST_LIMIT,
    });
  }
});

app.post("/api/links", decodeUser, async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "URL порожній" });

  const shortCode = Math.random().toString(36).substring(2, 8);

  if (req.user) {
    try {
      await dbRun(
        "INSERT INTO links (user_id, long_url, short_code) VALUES (?, ?, ?)",
        [req.user.userId, longUrl, shortCode],
      );
      return res.status(201).json({ message: "Посилання створено" });
    } catch (e) {
      return res.status(500).json({ error: "Помилка збереження в БД" });
    }
  } else {
    if (guestLinks.length >= GUEST_LIMIT) {
      return res
        .status(400)
        .json({ error: "Ліміт для гостей вичерпано! Зареєструйтесь." });
    }
    guestLinks.unshift({
      id: Date.now(),
      long_url: longUrl,
      short_code: shortCode,
    });
    return res.status(201).json({ message: "Посилання створено тимчасово" });
  }
});

app.put("/api/links/:id", decodeUser, async (req, res) => {
  const { id } = req.params;
  const { newLongUrl } = req.body;

  if (req.user) {
    try {
      await dbRun(
        "UPDATE links SET long_url = ? WHERE id = ? AND user_id = ?",
        [newLongUrl, id, req.user.userId],
      );
      return res.json({ message: "Оновлено" });
    } catch (e) {
      return res.status(500).json({ error: "Помилка оновлення" });
    }
  } else {
    const index = guestLinks.findIndex((l) => l.id === parseInt(id));
    if (index !== -1) {
      guestLinks[index].long_url = newLongUrl;
      return res.json({ message: "Тимчасове посилання оновлено" });
    }
    return res.status(404).json({ error: "Не знайдено" });
  }
});

app.delete("/api/links/:id", decodeUser, async (req, res) => {
  const { id } = req.params;

  if (req.user) {
    try {
      await dbRun("DELETE FROM links WHERE id = ? AND user_id = ?", [
        id,
        req.user.userId,
      ]);
      return res.json({ message: "Видалено" });
    } catch (e) {
      return res.status(500).json({ error: "Помилка видалення" });
    }
  } else {
    guestLinks = guestLinks.filter((l) => l.id !== parseInt(id));
    return res.json({ message: "Тимчасове посилання видалено" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, sex, dob } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Усі поля є обов'язковими для заповнення!" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Пароль має бути не менше 6 символів!" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const existingUsers = await dbQuery(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail],
    );
    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "Користувач з таким Email вже існує!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await dbRun(
      "INSERT INTO users (name, email, password, sex, dob) VALUES (?, ?, ?, ?, ?)",
      [name, cleanEmail, hashedPassword, sex || "Не вказано", dob],
    );

    const tokenPayload = { userId: result.id, email: cleanEmail };
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(201).json({
      message: "Реєстрація успішна",
      accessToken,
      user: { id: result.id, name, email: cleanEmail, sex, dob },
    });
  } catch (error) {
    console.error("Ошибка на сервере:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Будь ласка, введіть Email та Пароль!" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const users = await dbQuery("SELECT * FROM users WHERE email = ?", [
      cleanEmail,
    ]);

    if (users.length === 0) {
      return res
        .status(400)
        .json({ error: "Користувача з таким Email не знайдено!" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Невірний пароль!" });
    }

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "Вхід успішний",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        dob: user.dob,
      },
    });
  } catch (error) {
    console.error("Ошибка логина на сервере:", error);
    return res
      .status(500)
      .json({ error: "Внутрішня помилка сервера при спробі входу." });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Неавторизований (немає токена)" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await dbQuery(
      "SELECT id, name, email, sex, dob FROM users WHERE id = ?",
      [decoded.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    return res.json({ user: users[0] });
  } catch (error) {
    return res.status(401).json({ error: "Невалідний або прострочений токен" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`=== БЕКЕНД ShortyURL РАБОТАЕТ НА ПОРТУ ${PORT} ===`);
});
