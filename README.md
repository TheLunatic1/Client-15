<div align="center">

# 🔧 MyLocalPro

### *Australia's Premier Platform for Finding Verified Local Professionals*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Self--Hosted-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![Linux](https://img.shields.io/badge/Linux-VPS-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://www.linux.org/)

</div>

---

## 📌 About The Project

**MyLocalPro** is a full-stack web platform that bridges the gap between Australians looking for qualified tradespeople and skilled professionals ready to grow their business online.

Whether you need a plumber, electrician, builder, or digital service provider — MyLocalPro helps you **find verified pros**, read real reviews, and connect instantly.

> 🏆 **Featuring**: A monthly giveaway, a curated blog, a powerful admin panel, and dedicated dashboards for both customers and tradies.

---

## ✨ Features

### 🌐 Public-Facing Pages
- **Hero & Landing** — Eye-catching homepage with CTA, giveaway section, blog previews & featured tradies
- **Find A Pro** — Browse and filter verified professionals by category and location
- **Business Profiles** — Rich tradie profiles with photos, reviews, services, and contact info
- **Blog** — Informative articles managed by admins, organised by category
- **Giveaway** — Monthly prize draws with entry management
- **Join Now** — Multi-step signup flow for tradies to list their business
- **Contact** — Contact form with email notifications via [Resend](https://resend.com/)
- **Categories & Locations** — Dynamic filtering by trade type and Australian region

### 👤 User Dashboard
- Edit personal profile & avatar
- View and manage submitted reviews
- Track contact history and notifications

### 🔨 Tradie Dashboard
- Full business profile management (photos, services, description, location)
- Request account deletion
- View reviews and notification history
- Update password & account security

### 🛡️ Admin Super Panel
- **Overview** — Live stats, signup trends (Recharts), category breakdown, recent activity feed
- **Business Listings** — View, approve, reject, and delete business listings
- **Pending Approvals** — Review new tradie submissions with a rejection reason workflow
- **Blog Manager** — Full CRUD with image upload for blog posts
- **Giveaway Manager** — Manage and draw giveaway entries
- **Categories & Locations** — Add/edit/delete service categories and Australian locations
- **Users / Tradies** — Browse all registered users and tradie accounts
- **Settings** — Admin profile and security management

---

## 🛠️ Tech Stack

### Frontend (`Client-15`)

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite 8** | Lightning-fast build tool |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Admin dashboard data visualisation |
| **React Router v7** | Client-side routing |
| **Lucide React** | Icon library |
| **SweetAlert2** | Beautiful modal alerts |
| **Axios** | HTTP client |

### Backend (`Client-15-backend`)

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Multer** | File/image upload handling |
| **Resend** | Transactional email (contact form) |
| **Nodemon** | Dev hot-reload |

---

## 📁 Project Structure

```
📦 Client-15 (Frontend)
├── src/
│   ├── pages/
│   │   ├── Home/            # Landing page
│   │   ├── FindAPro/        # Pro search & business profiles
│   │   ├── JoinNow/         # Tradie registration flow
│   │   ├── Blog/            # Blog listing & articles
│   │   ├── Giveaway/        # Giveaway page
│   │   ├── Contact/         # Contact form
│   │   ├── Login/           # Auth pages
│   │   ├── Admin/           # 🛡️ Super admin dashboard
│   │   ├── TradieDashboard/ # 🔨 Tradie panel
│   │   ├── UserDashboard/   # 👤 Customer panel
│   │   ├── Categories/      # Category browsing
│   │   ├── Privacy/         # Privacy policy
│   │   └── Terms/           # Terms & conditions
│   ├── components/          # Reusable UI components
│   ├── api/                 # Axios API layer
│   └── utils/               # Helpers & validation

📦 Client-15-backend (Backend)
├── models/        # Mongoose schemas (User, Business, Blog, etc.)
├── routes/        # Express route handlers
├── middleware/    # Auth & upload middleware
├── config/        # DB config
└── server.js      # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- A [Resend](https://resend.com/) account (for email notifications)

---

## 🔑 User Roles

| Role | Access |
|---|---|
| **Guest** | Browse pros, read blogs, enter giveaways, contact form |
| **User** | All guest features + personal dashboard & reviews |
| **Tradie** | All user features + business listing management dashboard |
| **Admin** | Full super admin panel with platform control |

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/register` | Register a new user |
| `POST` | `/api/users/login` | Authenticate & receive JWT |
| `GET` | `/api/business` | List approved businesses |
| `POST` | `/api/business` | Submit a new business listing |
| `PUT` | `/api/business/:id/status` | Admin approve/reject listing |
| `GET` | `/api/blogs` | Fetch all blog posts |
| `POST` | `/api/blogs` | Create a blog post (admin) |
| `GET` | `/api/categories` | List all categories |
| `GET` | `/api/locations` | List all locations |
| `POST` | `/api/giveaway/enter` | Enter the giveaway |
| `POST` | `/api/contact` | Submit contact form |
| `GET` | `/api/stats/admin` | Admin stats & chart data |
| `POST` | `/api/upload` | Upload an image (returns URL) |

---

## 🌍 Deployment

Both the frontend and backend are **fully self-hosted on a Linux VPS** — no platform-as-a-service involved.

### Full-Stack VPS Hosting + Nginx

- **Nginx** serves the built React app (`dist/`) as static files and acts as a reverse proxy for the Node.js API
- **SSL/HTTPS** configured on Nginx for secure connections across the whole platform
- **SPA routing** handled by Nginx — all routes fall back to `index.html` so React Router works correctly
- **File uploads** handled server-side with `multer`, uploaded files served as static assets through Nginx
- **Client-side image compression** implemented on the frontend to stay within Nginx's upload size limits (resolved `413 Request Entity Too Large` errors)
- **Environment variables** securely stored on the server (never committed to the repo)
- **`nodemon`** in development; **`node server.js`** in production via `npm start`

> This project is fully self-managed — from DNS and SSL to reverse proxy rules, static file serving, and debugging mixed-content issues. No Vercel, no Railway, no managed hosting.

---

## 📄 License

This project is proprietary. All rights reserved © MyLocalPro.

---

<div align="center">

Built with ❤️ for Australian tradespeople and the communities they serve.

</div>
