import { integer, pgTable, serial, varchar, timestamp, text, pgEnum,
 } from "drizzle-orm/pg-core";
import { user,category } from "@/db/schema";
import { InferSelectModel, relations } from "drizzle-orm";
import { tag } from "./tag";
import { postTags } from "./postTages";
import { comment } from "./comment";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { title } from "process";
// import { comment } from "postcss";

// export const statusEnm = pgEnum("status", ["PUBLISHED", "DRAFT", "ARCHIVED"]);

export const post = pgTable("posts", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id),
    title: varchar("title", { length: 255 }).notNull(),
    shortDescription: text("short_description").notNull(),
    // statusEnm: statusEnm("status").notNull().default("DRAFT"),
    content: text("content").notNull(),
    categoryId: integer("category_id").notNull().references(() => category.id),
    createdAt: timestamp("created_at",{ mode: "string"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at",{mode: "string"}).notNull().defaultNow(),
})
export const postRelations = relations(post, ({ one,many }) => ({
    user: one(user, { fields: [post.userId], references: [user.id] }),
    category: one(category, { fields: [post.categoryId], references: [category.id] }),
    tags: many(postTags),
    comments: many(comment),
    // category: one(category, { fields: [post.categoryId], references: [category.id] }),
}))

const baseSchema = createInsertSchema(post,{
    title: (schema) => schema.title.min(1),
    shortDescription: (schema) => schema.shortDescription.min(1).max(255),
    content: (schema) => schema.content.min(1),
    categoryId: (schema) => schema.categoryId.min(1),
}).pick({
    title: true,
    shortDescription: true,
    content: true,
    categoryId: true,
    userId: true,
})
export const postSchema = z.union([
    z.object({
        mode:z.literal("create"),
        title: baseSchema.shape.title,
        shortDescription: baseSchema.shape.shortDescription,
        content: baseSchema.shape.content,
        categoryId: baseSchema.shape.categoryId,
        userId: baseSchema.shape.userId,
        tagIds: z.array(z.number()),
    }),
    z.object({
        mode:z.literal("edit"),
        id:z.number().min(1),
        title: baseSchema.shape.title,
        shortDescription: baseSchema.shape.shortDescription,
        content: baseSchema.shape.content,
        categoryId: baseSchema.shape.categoryId,
        userId: baseSchema.shape.userId,
        tagIds: z.array(z.number()),
    })
])

// export const PostSchema = createInsertSchema(category);
export type PostSchema = z.infer<typeof postSchema>;
export type SelectPostModel = InferSelectModel<typeof post>;