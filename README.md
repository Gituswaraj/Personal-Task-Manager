# TaskFlow — Personal Task Manager

TaskFlow is a full-stack personal task manager built to make everyday task tracking simple and pleasant. Users can create, edit, complete, search, reorder, and delete tasks through a clean and responsive interface.

Although the core idea is similar to a to-do list, I treated this project as an opportunity to build a complete full-stack application with a structured REST API, backend validation, persistent local storage, reusable frontend components, and a polished user experience.

## Live Demo

* **Frontend:** https://personal-task-manager-wine.vercel.app
* **Backend API:** https://personal-task-manager-ypli.onrender.com

> The backend is hosted on Render's free tier, so the first request may take a few seconds if the service has been inactive.

---

## Features

### Core Features

* Create a new task with a title, optional description, and optional due date
* View all tasks in a clean and organized list
* Edit existing task details
* Mark tasks as completed or active
* Delete tasks
* Search tasks by title
* Filter tasks by status: **All**, **Active**, or **Completed**
* Show active and completed task counts
* Display clear empty states and feedback messages

### Bonus Features

* Drag-and-drop task reordering
* JSON file persistence for local development
* Toast notifications for user actions
* Smooth UI animations and micro-interactions
* Responsive design for different screen sizes
* Backend integration tests using Vitest and Supertest

---

## Tech Stack

### Frontend

* **React with Vite and TypeScript**
  Used to build the user interface with functional components and hooks. TypeScript helps catch errors early and keeps the frontend code easier to maintain.

* **CSS Modules**
  Used for component-level styling without adding a large UI framework. This gave me more control over the warm and minimal visual style.

* **Lucide React**
  Used for lightweight and consistent icons.

* **@hello-pangea/dnd**
  Used to implement drag-and-drop task reordering.

### Backend

* **Node.js, Express, and TypeScript**
  Used to build the REST API and keep the server code structured and type-safe.

* **Zod**
  Used to validate incoming request data before it reaches the business logic.

* **JSON File Storage**
  Tasks are stored in `server/src/data/tasks.json`. This keeps the project simple and avoids unnecessary database setup for a small assignment.

* **Vitest and Supertest**
  Used for backend API integration testing.

---

## How I Used Antigravity

I used Antigravity as a supporting development tool during the project rather than relying on it to generate the entire application.

It mainly helped me:

* Organize parts of the project structure
* Improve some server-side logic
* Handle backend exceptions more cleanly
* Refine frontend CSS and visual details
* Review small implementation decisions while debugging
* Formatting documentation part

I manually reviewed, tested, and adjusted the suggested changes so that I understood how the final code worked.

---

## Getting Started Locally

### Prerequisites

Make sure the following tools are installed:

* Node.js version 18 or later
* npm
* Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd personal-task-manager
```

### 2. Start the Backend

Open a terminal and run:

```bash
cd server
npm install
npm run dev
```

The backend will run at:

```text
http://localhost:10000
```

### 3. Start the Frontend

Open a second terminal and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run on the local URL shown by Vite, usually:

```text
http://localhost:5173
```

### 4. Run Backend Tests

To run the backend API tests:

```bash
cd server
npm test
```

---

## API Documentation

The base URL for local development is:

```text
http://localhost:5000/api/tasks
```

| Method   | Endpoint             | Request Body                                     | Description                    |
| -------- | -------------------- | ------------------------------------------------ | ------------------------------ |
| `GET`    | `/api/tasks`         | —                                                | Get all tasks                  |
| `GET`    | `/api/tasks/:id`     | —                                                | Get a single task by ID        |
| `POST`   | `/api/tasks`         | `{ title, description?, dueDate? }`              | Create a new task              |
| `PATCH`  | `/api/tasks/:id`     | `{ title?, description?, dueDate?, completed? }` | Update an existing task        |
| `DELETE` | `/api/tasks/:id`     | —                                                | Delete a task                  |
| `PATCH`  | `/api/tasks/reorder` | `{ orderedIds: string[] }`                       | Save a new drag-and-drop order |

### Example Task Object

```typescript
{
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}
```

### Example Error Response

```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

---

## Validation Rules

The backend validates incoming data before processing it.

| Field         | Rule                                                        |
| ------------- | ----------------------------------------------------------- |
| `title`       | Required when creating a task and limited to 200 characters |
| `description` | Optional and limited to 1000 characters                     |
| `dueDate`     | Optional and stored as an ISO 8601 date string              |
| `completed`   | Must be a boolean value                                     |
| `orderedIds`  | Must be an array of task IDs                                |

---

## Project Structure

```text
Personal Task Manager/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components and CSS modules
│   │   ├── context/            # Shared task state management
│   │   ├── services/           # API request functions
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Date-related helper functions
│   │   ├── App.tsx             # Main application component
│   │   ├── index.css           # Global styles and design variables
│   │   └── main.tsx            # React entry point
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── data/               # JSON file used for task storage
│   │   ├── middleware/         # Validation and error-handling middleware
│   │   ├── models/             # Task schemas and types
│   │   ├── routes/             # Express routes
│   │   ├── services/           # Core CRUD logic
│   │   └── index.ts            # Server entry point
│   ├── tests/                  # Backend integration tests
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Key Design Decisions

### Why I Used JSON File Storage

For this assignment, a full SQL or NoSQL database would have added setup complexity without being necessary for the required functionality. A JSON file was enough to demonstrate persistence and keep the backend easy to run locally.

For a production version, I would replace this with a proper database such as PostgreSQL or SQLite.

### Why I Used CSS Modules

I wanted more control over the design instead of depending on a ready-made component library. CSS Modules allowed me to create scoped styles while keeping the interface lightweight and consistent.

### Why I Added Drag-and-Drop Reordering

Task order is important in a personal task manager. Drag-and-drop makes it easier for users to prioritize tasks naturally without editing each item individually.

---

## Current Limitations

To keep the project focused and complete within the available time, I did not add:

* User authentication
* Multi-user support
* A production-grade database
* Extensive frontend end-to-end tests
* Task categories or tags

**What I Would Build Next**

With more time, I would extend the application with:

* **Authentication and Multi-user Support**
Allow different users to manage their own private task lists.

* **Database Migration**
Replace JSON file storage with PostgreSQL or SQLite using Prisma.

* **Categories and Tags**
Let users group tasks into categories such as Work, Personal, or College.

* **Priority Levels**
Add High, Medium, and Low priority options.

* **Pagination**
Load tasks in smaller groups when the list becomes large.

* **Progressive Web App Support**
Make TaskFlow installable and more useful on mobile devices.

* **Frontend End-to-End Tests**
Add Playwright or Cypress tests for key user flows.

## Final Note

TaskFlow is intentionally simple, but it covers the full workflow of building and deploying a complete application: planning the UI, creating reusable components, designing REST endpoints, validating data, handling errors, testing the backend, and deploying both the frontend and server.

The project helped me improve my understanding of how a frontend and backend work together in a real application.
