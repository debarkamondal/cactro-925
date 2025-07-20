import type { RequestHandler } from '@sveltejs/kit';
interface CommentReplyRequest {
	parentCommentId: string;
	videoId: string;
	textOriginal: string;
}
interface YouTubeApiResponse {
	kind: string;
	etag: string;
	id: string;
	snippet: {
		videoId: string;
		textDisplay: string;
		textOriginal: string;
		parentId: string;
		authorDisplayName: string;
		authorProfileImageUrl: string;
		authorChannelUrl: string;
		likeCount: number;
		publishedAt: string;
		updatedAt: string;
	};
}
interface ApiError {
	error: {
		code: number;
		message: string;
		errors: Array<{
			domain: string;
			reason: string;
			message: string;
		}>;
	};
}

let url = 'https://www.googleapis.com/youtube/v3/comments?part=snippet';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const replyData: CommentReplyRequest = await request.json();
	const accessToken = JSON.parse(cookies.get('session') as string).access_token;

	const requestBody = {
		snippet: {
			parentId: replyData.parentCommentId,
			textOriginal: replyData.textOriginal,
			videoId: replyData.videoId
		}
	};

	const headers = {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json'
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			const errorData: ApiError = await response.json();
			throw new Error(
				`YouTube API Error: ${errorData.error.message} (Code: ${errorData.error.code})`
			);
		}
		const res = await response.json();

		return new Response(res, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to post reply: ${error.message}`);
		}
		throw new Error('Failed to post reply: Unknown error');
	}
};
