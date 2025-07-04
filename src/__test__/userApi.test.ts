import request from "supertest";
import app from "../index";

describe("User API", () => {
  let userId: string;

  afterAll((done) => {
    app.close(done);
  });

  it("GET /api/users - should return an empty array initially", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("POST /api/users - should create a new user", async () => {
    const newUser = { username: "John", age: 30, hobbies: ["reading"] };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
    expect(response.body).toHaveProperty("id");
    userId = response.body.id;
  });

  it("GET /api/users/:userId - should get the created user by ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: userId,
      username: "John",
      age: 30,
      hobbies: ["reading"]
    });
  });

  it("PUT /api/users/:userId - should update the user details", async () => {
    const updatedUser = { username: "John Updated", age: 31, hobbies: ["writing"] };
    const response = await request(app).put(`/api/users/${userId}`).send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: userId,
      username: "John Updated",
      age: 31,
      hobbies: ["writing"]
    });
  });

  it("DELETE /api/users/:userId - should delete the user", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
