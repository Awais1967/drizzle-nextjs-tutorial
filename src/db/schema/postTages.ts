import {integer, pgTable, serial, varchar,primaryKey} from "drizzle-orm/pg-core";
import {post} from "./post";
import {tag} from "./tag";
import { table } from "console";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const postTags = pgTable("post_to_tags", {
    // id: serial("id").primaryKey(),
    postId: integer("post_id").notNull().references(() => post.id),
    tagId: integer("tag_id").notNull().references(() => tag.id),
},(table) => ({
    pk: primaryKey({columns: [table.postId, table.tagId]}),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
    post: one(post, { fields: [postTags.postId], references: [post.id] }),
    tag: one(tag, { fields: [postTags.tagId], references: [tag.id] }),
}))

export const posttagSchema = createInsertSchema(postTags);
export type Posttag = z.infer<typeof posttagSchema>;