"use server";

import { GoogleGenAI } from "@google/genai";
import { neon } from "@neondatabase/serverless";
import { generateUUID } from "@/lib/utils";

export async function getUserDetails(userId: string | undefined) {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	if (!userId) {
		return null;
	}

	const sql = neon(process.env.DATABASE_URL);
	const [user] =
		await sql`SELECT * FROM neon_auth.users_sync WHERE id = ${userId};`;
	return user;
}

export async function createProject(userId: string | undefined, type: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	if (!userId) {
		return "/";
	}

	const sql = neon(process.env.DATABASE_URL);
	const projectId = generateUUID();

	try {
		await sql`
      INSERT INTO projects (id, user_id, type, created_at)
      VALUES (${projectId}, ${userId}, ${type}, NOW())
    `;
		const projectUrl = `/${type}/${projectId}`;
		return projectUrl;
	} catch (error) {
		console.error("Error creating project:", error);
		return "/";
	}
}

export async function getProjectFromDatabase(
	projectId: string,
	userId?: string,
) {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const sql = neon(process.env.DATABASE_URL);

	try {
		const [project] = await sql`
      SELECT *
      FROM projects
      WHERE id = ${projectId}
      ${userId ? sql`AND user_id = ${userId}` : sql``}
    `;
		return project;
	} catch (error) {
		console.error("Error getting project:", error);
		return null;
	}
}

export async function getAICompletion(
	text: string,
	geminiKey?: string | null,
): Promise<string | null> {
	if (!text) return null;

	const content = `Complete the following text, respond. Only provide the completion, do not repeat the original text: "${text}"`;

	if (geminiKey) {
		const ai = new GoogleGenAI({ apiKey: geminiKey });
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: content,
		});

		if (response.text) {
			return response.text;
		}
	}

	try {
		const response = await fetch("https://ai.hackclub.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: [{ role: "user", content: content }],
			}),
		});

		const data = await response.json();

		if (data.choices && data.choices.length > 0) {
			let completion = data.choices[0].message.content;

			if (completion.startsWith('"') && completion.endsWith('"')) {
				completion = completion.slice(1, -1);
			}

			return completion;
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error fetching AI completion:", error);
		return null;
	}
}
