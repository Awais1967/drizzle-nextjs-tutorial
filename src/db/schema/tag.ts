import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { post } from "./post";
import { postTags } from "./postTages";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tag = pgTable("tags", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
})

export const tagRelations = relations(tag, ({ many }) => ({
    posttotag: many(postTags),
}))

export const tagSchema = createInsertSchema(tag);
export type TagSchema = z.infer<typeof tagSchema>;