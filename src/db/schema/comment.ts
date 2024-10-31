 import {
    AnyPgColumn,integer, pgTable, serial, varchar, timestamp,text
 } from 'drizzle-orm/pg-core'

 import { user } from './user'
import { post } from './post'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
 
 export const comment = pgTable("comment", {
     id: serial("id").primaryKey(),
     parentId: integer("parent_id").references((): AnyPgColumn => comment.id),
     postId: integer("post_id").notNull().references(() => post.id),
     userId: integer("user_id").notNull().references(() => user.id),
     content: text("content").notNull(),
     createdAt: timestamp("created_at",{ mode: "string"}).notNull().defaultNow(),
     updatedAt: timestamp("updated_at",{mode: "string"}).notNull().defaultNow(),
 })
 
 export const commentRelations = relations(comment, ({ one }) => ({
     user: one(user, { fields: [comment.userId], references: [user.id] }),
     post: one(post, { fields: [comment.postId], references: [post.id] }),
 }))

export const commentSchema = createInsertSchema(comment,{
    postId: (schema) => schema.postId.min(1),
    content: (schema) => schema.content.min(1),
    userId: (schema) => schema.userId.min(1),
}).pick({
        postId: true,
        content: true,
        userId: true,
        parentId: true,
        id: true,

});
// export const commentSchema = createInsertSchema(comment);
export type CommentSchema = z.infer<typeof commentSchema>;