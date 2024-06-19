"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/db";
import { comment, CommentSchema, commentSchema } from "@/db/schema/comment";

export async function createComment(data: CommentSchema) {
	const session = await auth();
	if (!session) notFound();

	const validation = commentSchema.safeParse(data);

	if (!validation.success) {
		return {
			success: false,
			message: "Invalid data",
		};
	}

	await db.insert(comment).values(data);

	revalidatePath(`/posts/${data.id}`);

	return { success: true, message: "Comment created successfully." };
}
