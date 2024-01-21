import knex, { Knex } from "knex";
const db = knex(require("../knexfile").development);

export interface Video {
  id: string;
  title: string;
  file_path: string;
  status: string;
}

interface insertVideo extends Omit<Video, "id" | "status"> {}

class VideoService {
  db: Knex;
  table = "videos";
  constructor(db: Knex) {
    this.db = db;
  }

  async create(video: insertVideo | insertVideo[]) {
    return await db.insert(video).into(this.table).returning("*");
  }

  async update(id: string, video: Video) {
    return await db
      .update(video)
      .from(this.table)
      .where("id", id)
      .returning("*");
  }

  async updateVideoStatus(id: number, status: "ready" | "failed" | "encoding") {
    return await db.update({ status }).from(this.table).where("id", id);
  }

  async delete(id: string) {
    return await db.delete().from(this.table).where("id", id);
  }

  async deleteAll() {
    return await db.delete().from(this.table);
  }

  async get(id: string): Promise<Video | undefined> {
    return await db.select("*").from(this.table).where("id", id).first();
  }

  async getAll() {
    return await db.select("*").from(this.table);
  }
}

export const videoDB = new VideoService(db);

export default db;
