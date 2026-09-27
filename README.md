# img2url ⚡

**img2url** is a web application designed for high-speed image hosting and instant global CDN deployment. It allows developers, creators, and users to transform local images (PNG, JPG, WEBP, SVG, GIF) into production-ready direct links, HTML snippets, and Markdown embed tags within seconds.

---

## 🚀 Key Features

* **Instant Image Deployment**: Upload local files via drag-and-drop or file picker and instantly receive formatted production URLs.
* **Format & Snippet Generation**: Auto-generates direct image links, `<img />` HTML snippets, and Markdown tags `![]()` with one-click clipboard copying.
* **Preset Sample Assets**: Includes pre-configured sample images (Avatar, Nature, Neon) for quick demo testing without local file selection.
* **Authentication & User Accounts**: User registration, login, JWT token handling (stored in `localStorage`), and logout support.
* **User Profile Management**: Authenticated profile management with capabilities to view and patch user name, email, and password.
* **Backend Health Monitoring**: Live status indicator displaying edge CDN health and connectivity state with the backend service.
* **Responsive Dark UI**: Modern dark theme UI with custom CSS gradients, glow effects, interactive dropzone, and responsive mobile layouts.

---

## 🛠️ Architecture & Tech Stack

* **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, Nitro engine, Vite)
* **Styling**: Single-file component custom CSS design with CSS variables, flexbox, grid, and dark mode aesthetic
* **State Management**: Vue 3 Composition API (`ref`, `onMounted`)
* **Backend API Host**: `https://img2url-backend.onrender.com`

---

## 📡 API Endpoint Specifications

The frontend interacts with the backend service hosted at `https://img2url-backend.onrender.com`.

### Health Check
* `GET /`
  * **Description**: Verifies API availability. Returns standard HTTP status 200 on success.

### Image Deployment
* `POST /img-deploy`
  * **Content-Type**: `multipart/form-data`
  * **Payload**: `file` (Binary image file: PNG, JPG, WEBP, SVG, GIF; up to 10MB)
  * **Response**:
    ```json
    {
      "url": "https://img2url-backend.onrender.com/uploads/example.png",
      "originalname": "example.png",
      "size": 102400,
      "mimetype": "image/png"
    }
    ```

### Authentication
* `POST /api/auth/register`
  * **Payload**: `{ "fullName": "Jane Doe", "email": "jane@example.com", "password": "secretpassword" }`
  * **Response**: Returns JWT `access_token` and `user` object.
* `POST /api/auth/login`
  * **Payload**: `{ "email": "jane@example.com", "password": "secretpassword" }`
  * **Response**: Returns JWT `access_token` and `user` object.
* `POST /api/auth/logout`
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Description**: Invalidates user session / token.

### User Profile
* `GET /api/auth/me`
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Response**: Current authenticated user details.
* `PATCH /api/auth/me`
  * **Headers**: `Authorization: Bearer <access_token>`
  * **Payload**: Optional JSON fields (`fullName`, `email`, `password`)
  * **Response**: Updated user details message.

---

## 📂 Project Structure

```text
├── app/
│   └── app.vue           # Main application view with header, hero upload UI, modals, and footer
├── public/
│   ├── favicon.ico       # Favicon asset
│   └── robots.txt        # Search engine directives
├── nuxt.config.ts        # Nuxt configuration (head metadata, devtools, compatibility)
├── package.json          # Dependencies and npm scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Developer documentation
```

---

## 💻 Getting Started & Local Development

### Prerequisites

* Node.js `v18.0.0` or higher
* npm, pnpm, yarn, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd img2url
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `nuxt dev` | Starts local development server at `http://localhost:3000` |
| `build` | `nuxt build` | Compiles and builds production-ready bundle |
| `generate` | `nuxt generate` | Pre-renders static site output |
| `preview` | `nuxt preview` | Previews production build locally |
| `postinstall` | `nuxt prepare` | Generates Nuxt TypeScript types |

---

## 🔧 Deployment & Build

To generate a production build:

```bash
npm run build
```

The output build will be created in `.output/server/index.mjs` (Node-server Nitro preset).

---

## 📄 License

This project is proprietary / open source under standard project distribution.
