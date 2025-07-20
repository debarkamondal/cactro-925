import { YT_API_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { decodeAndFilterComments, type FormattedCommentThread } from '$lib/commentDecode';
const videoId = '8AaGzbNTbWk';
const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`;
const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=20&key=${YT_API_KEY}&textFormat=plainText`;

type Session = {
	id: string;
	email: string;
	name: string;
	picture: string;
	verified_email: string;
	access_token: string;
};
export const load: PageServerLoad = async ({ cookies }) => {
	const res = await fetch(detailsUrl);
	const commentsRes = await fetch(commentsUrl);
	const details = await res.json();
	const comments = await commentsRes.json();
	const data = decodeAndFilterComments(comments.items);
	let props: {
		details: any;
		comments: FormattedCommentThread[];
		session: Session | null;
	} = {
		details: details.items[0].snippet,
		comments: data,
		session: null
	};
	if (cookies.get('session')) props.session = JSON.parse(cookies.get('session') as string);
	return props;
};
