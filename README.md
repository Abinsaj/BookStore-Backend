
# 📚 Bookstore Backend API

A robust Node.js backend for an online bookstore, designed with clean architecture, secure authentication, role-based access control, and background job processing for scalable email notifications.

---

## ⚙️ Tech Stack

* **Node.js** + **Express.js** — RESTful API framework
* **MongoDB** + **Mongoose** — Flexible NoSQL database
* **Redis** + **BullMQ** — Background job queue for async tasks and rate-limited email sending
* **Nodemailer** — Email service for transactional messages
* **JWT** — Secure token-based authentication
* **dotenv** — Environment configuration

---

## 🗂️ Project Structure

```
/backend
 ├── src/
 │   ├── config/          # MongoDB & Redis configs
 │   ├── controllers/     # Route handlers
 │   ├── services/        # Business logic layer
 │   ├── repositories/    # Data access logic
 │   ├── models/          # Mongoose schemas
 │   ├── routes/          # Express routes
 │   ├── middlewares/     # Auth, error handler, asyncHandler
 │   ├── utils/           # AppError, email sender
 │   ├── jobs/            # BullMQ queue definitions
 │   ├── workers/         # Workers to process background jobs
 │   ├── app.js           # Express app config
 │   ├── server.js        # Entry point
 ├── .env                 # Environment variables
 ├── package.json
 ├── README.md
```

---

## ✅ Features

### ✔️ Authentication & Roles

* Users register with role: **admin**, **author**, or **retail**
* JWT for secure API access
* Middleware: `verifyToken` & `checkRole` protect routes

---

### ✔️ Book Management

* **Unique bookId:** Format `book-1`, `book-2`, auto-generated
* **Slug:** Clean URLs using slugified title; duplicates handled as `title-1`, `title-2`
* **Price validation:** Must be between `100–1000`; returns user-friendly error
* **Sell Count:** Automatically updated with every purchase

---

## 📈 Logic for Computing `sellCount`

> **How does `sellCount` work?**
> Every time a user purchases a book, the `sellCount` is incremented based on the quantity purchased. This is handled **atomically** using MongoDB’s `$inc` operator.

Example logic:

await BookModel.findByIdAndUpdate(
  bookId,
  { $inc: { sellCount: quantity } },
  { new: true }
);


* ✅ **Atomicity:** `$inc` is a server-side operation; avoids race conditions if multiple purchases happen at once.
* ✅ **Data Integrity:** Ensures accurate tracking for analytics and popularity ranking.

---

## 📧 Mechanism for Sending Email Notifications

**How it works:**

1. **BullMQ Queue:**

   * Configured with Redis.
   * `limiter` ensures **max 100 emails/minute** to avoid SMTP throttling.


   export const emailQueue = new Queue('emailQueue', { connection, limiter: { max: 100, duration: 60000 } });


2. **Job Creation:**

   * When a purchase occurs, `PurchaseService` enqueues a job:


   await emailQueue.add('authorNotification', {
     authorId: book.authors,
     purchaseDetails: { bookTitle: book.title, price: book.price, quantity }
   });


3. **Worker:**

   * `emailWorker.js` pulls jobs from the queue.
   * Uses **Nodemailer** to send a personalized email to the author.
   * Each email includes:

     * Book details
     * Purchase quantity and total
     * Revenue: **current month**, **current year**, **total revenue**

4. **Revenue Details:**

   * Author’s revenue is updated using `$inc`.
   * Revenue data is included in the email to keep authors informed about their earnings.

---

## 🗃️ Database Design Choices

> **Why this structure?**
> Focus: clean separation of concerns, scalability, and consistency.

1. **User Model:**

   * Unified schema for `admin`, `author`, `retail` with `role` enum.
   * Authors have a `revenue` field that updates automatically.

2. **Book Model:**

   * Contains `bookId`, `title`, `slug`, `sellCount`, `authors` (array of user references).
   * Pre-save or service logic ensures unique slugs.

3. **Purchase Model:**

   * Unique `purchaseId` generated per month (`YYYY-MM-1`, `YYYY-MM-2`).
   * Linked to both `userId` and `bookId`.

4. **Atomic Updates:**

   * `$inc` ensures no conflicts when multiple updates happen simultaneously.
   * Protects `sellCount` and `revenue` from race conditions.

5. **Job Queues:**

   * Decouple time-consuming tasks like sending bulk emails.
   * Redis + BullMQ allow horizontal scaling if needed.

---

## 🔒 Security & Best Practices

* **Auth:** JWTs stored in `Authorization` header (`Bearer` token)
* **RBAC:** Roles enforced with `checkRole`
* **Error Handling:** Global error handler via custom `AppError` class
* **Async Operations:** All controllers use `asyncHandler` to catch errors

---

## 🗃️ Environment Variables

Create a `.env` file:

env
PORT=5000

MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=YOUR_SECRET_KEY

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password


**Note:** For Gmail, use an **App Password** for secure SMTP.

---

## 🏃 How to Run

1. **Clone**

   git clone https://github.com/yourusername/bookstore-backend.git
   cd bookstore-backend


2. **Install Dependencies**


   npm install


3. **Start MongoDB & Redis**

   redis-server

4. **Start the Server**

   npm run dev

5. **Start the Worker**

   node src/workers/emailWorker.js

---

## 🗂️ API Usage

* Register/login to get a JWT.
* Use your JWT in Postman: `Authorization: Bearer <token>`.
* Authors: create books.
* Retail users: purchase books.
* Authors receive **purchase notifications**.
* Users get **new book** updates (bulk email supported, 100/min rate limit).

---




