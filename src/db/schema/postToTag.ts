import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { post, tag } from "@/db/schema";

// TODO: change to postTags
export const postToTag = pgTable(
	"post_to_tag",
	{
		postId: integer("post_id")
			.notNull()
			.references(() => post.id),
		tagId: integer("tag_id")
			.notNull()
			.references(() => tag.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.postId, table.tagId] }),
	})
);

export const postToTagRelations = relations(postToTag, ({ one }) => ({
	tag: one(tag, { fields: [postToTag.tagId], references: [tag.id] }),
	post: one(post, { fields: [postToTag.postId], references: [post.id] }),
}));

const insertPostToTagSchema = createInsertSchema(postToTag);
export type InsertPostToTagSchema = z.infer<typeof insertPostToTagSchema>;