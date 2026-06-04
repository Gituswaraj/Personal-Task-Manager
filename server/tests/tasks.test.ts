import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../src/index";

const DATA_FILE = path.join(__dirname, "..", "src", "data", "tasks.json");

// Reset tasks.json before each test
beforeEach(() => {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
});

describe("Task API", () => {
  // ── POST /api/tasks ────────────────────────────────────────────────
  describe("POST /api/tasks", () => {
    it("should create a new task and return 201", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Test task" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Test task");
      expect(res.body.completed).toBe(false);
      expect(res.body.description).toBe("");
      expect(res.body.dueDate).toBeNull();
    });

    it("should return 400 when title is missing", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ description: "No title" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.message).toBe("Validation failed");
    });

    it("should create a task with all fields", async () => {
      const dueDate = new Date().toISOString();
      const res = await request(app).post("/api/tasks").send({
        title: "Full task",
        description: "A detailed description",
        dueDate,
      });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Full task");
      expect(res.body.description).toBe("A detailed description");
      expect(res.body.dueDate).toBe(dueDate);
    });
  });

  // ── GET /api/tasks ─────────────────────────────────────────────────
  describe("GET /api/tasks", () => {
    it("should return an empty array when no tasks exist", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return tasks sorted by newest first", async () => {
      await request(app).post("/api/tasks").send({ title: "First" });
      // Small delay to ensure different timestamps
      await new Promise((r) => setTimeout(r, 10));
      await request(app).post("/api/tasks").send({ title: "Second" });

      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe("Second");
      expect(res.body[1].title).toBe("First");
    });
  });

  // ── PATCH /api/tasks/:id ───────────────────────────────────────────
  describe("PATCH /api/tasks/:id", () => {
    it("should toggle task completion", async () => {
      const createRes = await request(app)
        .post("/api/tasks")
        .send({ title: "Toggle me" });

      const id = createRes.body.id;
      expect(createRes.body.completed).toBe(false);

      const toggleRes = await request(app)
        .patch(`/api/tasks/${id}`)
        .send({ completed: true });

      expect(toggleRes.status).toBe(200);
      expect(toggleRes.body.completed).toBe(true);
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app)
        .patch("/api/tasks/00000000-0000-0000-0000-000000000000")
        .send({ title: "Updated" });

      expect(res.status).toBe(404);
    });
  });

  // ── DELETE /api/tasks/:id ──────────────────────────────────────────
  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task and return success message", async () => {
      const createRes = await request(app)
        .post("/api/tasks")
        .send({ title: "Delete me" });

      const id = createRes.body.id;

      const deleteRes = await request(app).delete(`/api/tasks/${id}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe("Task deleted successfully");

      // Verify it's gone
      const getRes = await request(app).get(`/api/tasks/${id}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 for non-existent task", async () => {
      const res = await request(app).delete(
        "/api/tasks/00000000-0000-0000-0000-000000000000"
      );
      expect(res.status).toBe(404);
    });
  });
});
