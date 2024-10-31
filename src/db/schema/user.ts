import { InferSelectModel, relations } from "drizzle-orm";
import {
    integer, pgTable, serial, varchar, timestamp
} from "drizzle-orm/pg-core"
import { post } from "./post";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const user = pgTable("users", {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at",{ mode: "string"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at",{mode: "string"}).notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
    posts: many(post),
}));

const baseSchema = createInsertSchema(user,{
    fullName: (schema) => schema.fullName.min(1),
    password: (schema) => schema.password.min(1).max(255),
    age: (schema) => schema.age.min(1),
    email: (schema) => schema.email.min(1),
}).pick({
    fullName: true,
    password: true,
    age: true,
    email: true,
})
export const userSchema = z.union([
    z.object({
        mode:z.literal("signUp"),
        email: baseSchema.shape.email,
        fullName: baseSchema.shape.fullName,
        password: baseSchema.shape.password,
    }),
    z.object({
        mode:z.literal("signIn"),
        email: baseSchema.shape.email,
        password: baseSchema.shape.password,
    }),
    z.object({
        mode:z.literal("update"),
        id: z.number().min(1),
        fullName: baseSchema.shape.fullName,
        age: baseSchema.shape.age,
     
    })     
])

// export const PostSchema = createInsertSchema(category);
export type UserSchema = z.infer<typeof userSchema>;
export type SelectUserModel = InferSelectModel<typeof user>;