# TaskFlow - Personal Task Manager

## Project Title & Brief Description
**TaskFlow** is a full-stack personal task manager (a glorified to-do list) that allows users to create, view, update, and delete personal tasks. It features a clean, vibrant UI, smooth animations, and robust backend validation. This project fulfills the requirements for the "Personal Task Manager" assignment, focusing on clean separation of concerns, solid REST API design, and a highly polished user experience.

## Live Demo Links
- **Frontend (Vercel):** *[Insert Vercel Link Here after deployment]*
- **Backend API (Render):** *[Insert Render Link Here after deployment]*

> **Note to reviewers:** When opening the deployed frontend for the first time, the backend might take ~50 seconds to spin up from sleep (standard Render free-tier behavior). Please allow a moment for the initial task list to load. Test in an incognito window as requested.

## Tech Stack
### Frontend
- **React (Vite) with TypeScript:** Functional components and hooks only. Vite provides a blazingly fast development experience, and TypeScript ensures type safety across the application.
- **CSS Modules:** Chosen for component-scoped styling without the need for heavy external frameworks or runtime overhead. This allows for precise control over the warm, humanized aesthetic.
- **Lucide React:** A lightweight and beautiful icon library.
- **@hello-pangea/dnd:** A maintained fork of `react-beautiful-dnd` used for the drag-and-drop reordering bonus feature.

### Backend
- **Node.js with Express & TypeScript:** A robust and industry-standard choice for RESTful APIs.
- **Zod:** Used for schema declaration and validation to ensure all incoming data is strictly typed and valid before processing.
- **JSON File Persistence:** Tasks are saved to `server/src/data/tasks.json` so data survives server restarts (fulfills the "Nice to Have" requirement), simulating a simple database without setup overhead.
- **Vitest & Supertest:** Modern, fast testing tools for API integration tests.

## How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup

1. **Clone the repository and navigate to the project directory:**
   ```bash
   git clone <your-repo-url>
   cd "Personal Task Manager"
   ```

2. **Start the Backend Server (Terminal 1):**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   *The API will start at `http://localhost:5000`*

3. **Start the Frontend Application (Terminal 2):**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The React app will start at `http://localhost:5173`*

4. **Run Backend Tests (Optional):**
   ```bash
   cd server
   npm test
   ```

## API Documentation

The backend exposes a REST API at `http://localhost:5000/api/tasks`.

| Method | Path | Request Body | Response | Description |
|--------|------|--------------|----------|-------------|
| `GET` | `/api/tasks` | — | `Task[]` | Get all tasks, sorted by newest first |
| `GET` | `/api/tasks/:id` | — | `Task` | Get a single task by ID |
| `POST` | `/api/tasks` | `{ title, description?, dueDate? }` | `Task` (201) | Create a new task (title required, max 200 chars) |
| `PATCH` | `/api/tasks/:id` | `{ title?, description?, dueDate?, completed? }` | `Task` | Update any field(s) of a task |
| `DELETE` | `/api/tasks/:id` | — | `{ message }` (200) | Delete a task |
| `PATCH` | `/api/tasks/reorder`| `{ orderedIds: string[] }` | `Task[]` | Update task ordering based on drag-and-drop |

**Task Object Shape:**
```typescript
{
  id: string;           // UUID
  title: string;        // 1-200 chars
  description: string;  // Max 1000 chars, default ""
  dueDate: string | null; // ISO 8601 date string or null
  completed: boolean;
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
  order: number;        // integer
}
```

**Standard Error Response (400/404/500):**
```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

## Project Structure

```text
Personal Task Manager/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components & CSS modules
│   │   ├── context/            # TaskContext for global state management
│   │   ├── services/           # API client wrapper
│   │   ├── types/              # TypeScript interfaces (mirrors backend)
│   │   ├── utils/              # Date formatting & checking utilities
│   │   ├── App.tsx             # Main application assembly
│   │   ├── index.css           # Global design system variables & resets
│   │   └── main.tsx            # React root mount
│   └── vite.config.ts
│
├── server/                     # Node.js Express Backend
│   ├── src/
│   │   ├── data/               # tasks.json (persistent storage)
│   │   ├── middleware/         # Zod validation & global error handlers
│   │   ├── models/             # Task schemas
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Core business logic (CRUD operations)
│   │   └── index.ts            # Express server initialization
│   ├── tests/                  # Integration tests (supertest + vitest)
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                   # This file
```

## Next Steps

**What I accomplished (including bonuses):**
- Full CRUD operations with clean separation of concerns.
- Search tasks by title and filter by status.
- JSON file persistence (server restarts won't wipe data).
- Drag-and-drop reordering.
- Polished, responsive UI with non-default colors, micro-animations, empty states, and toast notifications.
- Strong backend validation with precise error messages.

**What I chose not to do (due to time constraint):**
- Setup a full SQL/NoSQL database (JSON file was sufficient for the requirements).
- Extensive frontend end-to-end testing (e.g. Playwright/Cypress), focusing on core backend API tests instead.
- User Authentication (explicitly out of scope in the brief).

**What I would build next (with more time):**
- **Authentication & Multi-user Support:** Move from a single-user assumptions to a real multi-tenant system.
- **Database Migration:** Swap the JSON file out for SQLite or PostgreSQL using an ORM like Prisma.
- **Categories/Tags:** Allow users to label tasks to group them (e.g., "Work", "Personal").
- **Pagination:** If the task list grows very large, load it in chunks rather than sending the entire array at once.
- **PWA Capabilities:** Add a service worker and manifest to make it installable on mobile devices.
