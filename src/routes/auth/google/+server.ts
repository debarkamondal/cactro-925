import { redirect, type RequestHandler } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies }) => {
	// Generate state parameter for CSRF protection
	const state = crypto.randomUUID();
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});

	// Build Google OAuth URL
	// const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
	googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
	googleAuthUrl.searchParams.set('response_type', 'code');
	googleAuthUrl.searchParams.set(
		'scope',
		'openid email profile https://www.googleapis.com/auth/youtube.force-ssl'
	);
	googleAuthUrl.searchParams.set('state', state);

	throw redirect(302, googleAuthUrl.toString());
};
