interface YoutubeCommentSnippet {
	authorChannelId: { value: string };
	authorChannelUrl: string;
	authorDisplayName: string;
	authorProfileImageUrl: string;
	canRate: boolean;
	channelId: string;
	likeCount: number;
	parentId?: string; // Present for replies
	publishedAt: string;
	textDisplay: string;
	textOriginal: string;
	updatedAt: string;
	videoId: string;
	viewerRating: string;
}

interface YoutubeComment {
	etag: string;
	id: string;
	kind: string;
	snippet: YoutubeCommentSnippet;
}

interface YoutubeReplyComments {
	comments: YoutubeComment[];
}

interface YoutubeCommentThreadSnippet {
	canReply: boolean;
	channelId: string;
	isPublic: boolean;
	topLevelComment: YoutubeComment;
	totalReplyCount: number;
	videoId: string;
}

interface YoutubeCommentThread {
	etag: string;
	id: string;
	kind: string;
	replies?: YoutubeReplyComments; // Optional, as some comments might not have replies
	snippet: YoutubeCommentThreadSnippet;
}

interface ExtractedComment {
	id: string;
	username: string;
	profile_picture: string;
	text: string;
}

export interface FormattedCommentThread {
	comment: ExtractedComment;
	replies?: ExtractedComment[];
}

export function decodeAndFilterComments(data: YoutubeCommentThread[]): FormattedCommentThread[] {
	const filteredThreads = data.map((thread) => {
		const filteredData: FormattedCommentThread = {
			comment: {
				id: thread.snippet.topLevelComment.id,
				text: thread.snippet.topLevelComment.snippet.textDisplay,
				profile_picture: thread.snippet.topLevelComment.snippet.authorProfileImageUrl,
				username: thread.snippet.topLevelComment.snippet.authorDisplayName
			},
			replies: thread.replies?.comments.map((reply) => {
				return {
					id: reply.id,
					profile_picture: reply.snippet.authorProfileImageUrl,
					text: reply.snippet.textDisplay,
					username: reply.snippet.authorDisplayName
				};
			})
		};
		return filteredData;
	});
	return filteredThreads;
}
