import { redirect, error, type RequestHandler } from '@sveltejs/kit';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');

	// Verify state parameter
	if (!state || !storedState || state !== storedState) {
		throw error(400, 'Invalid state parameter');
	}

	// Clear the state cookie
	cookies.delete('oauth_state', { path: '/' });

	if (!code) {
		throw error(400, 'Authorization code not received');
	}

	try {
		// Exchange code for access token
		const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				code,
				grant_type: 'authorization_code',
				redirect_uri: GOOGLE_REDIRECT_URI
			})
		});

		const tokenData = await tokenResponse.json();

		if (!tokenResponse.ok) {
			console.error('Token exchange error:', tokenData);
			throw error(400, 'Failed to exchange authorization code');
		}

		// Get user info from Google
		const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		});

		const userData = await userResponse.json();

		if (!userResponse.ok) {
			console.error('User info error:', userData);
			throw error(400, 'Failed to get user information');
		}

		// Here you would typically:
		// 1. Check if user exists in your database
		// 2. Create user if they don't exist
		// 3. Generate your own session token/JWT
		// 4. Set session cookie

		// For this example, we'll just set a simple session cookie
		const sessionData = {
			id: userData.id,
			email: userData.email,
			name: userData.name,
			picture: userData.picture,
			verified_email: userData.verified_email
		};

		// Set session cookie (you should encrypt this in production)
		cookies.set('session', JSON.stringify(sessionData), {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});
	} catch (err) {
		console.error('OAuth callback error:', err);
		throw error(500, 'Authentication failed');
	}
	redirect(302, '/');
};
