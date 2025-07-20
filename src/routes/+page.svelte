<script lang="ts">
	import GoogleOauthButton from '$lib/components/GoogleOauthButton.svelte';

	let innerWidth = $state(0);
	let comment = $state<string>();
	const { data } = $props();
	const videoId = '8AaGzbNTbWk';

	const postReply = async ({
		parentCommentId,
		textOriginal,
		videoId
	}: {
		parentCommentId: string;
		textOriginal: string;
		videoId: string;
	}) => {
		await fetch('/reply', {
			method: 'POST',
			body: JSON.stringify({
				parentCommentId,
				textOriginal,
				videoId
			})
		});
	};
</script>

<h1 class="my-2 mb-4 text-center text-4xl font-semibold">Dezire's YT Dashboard</h1>
<svelte:window bind:innerWidth />
<iframe
	width={innerWidth}
	height="315"
	src="https://www.youtube.com/embed/8AaGzbNTbWk?si=b6fcBo64o_Tmss2d"
	title="YouTube video player"
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	referrerpolicy="strict-origin-when-cross-origin"
	allowfullscreen
	class="mx-auto max-w-full"
></iframe>

<h2 class="my-4 text-center text-3xl font-semibold">{data.details.title}</h2>
<div class="flex items-center justify-between px-2">
	<h2 class="my-4 text-center text-3xl font-semibold">Comments</h2>
	<!-- <button class="h-max rounded-md bg-blue-700 p-2 text-white">Sign in</button> -->
	{#if !data.session}
		<GoogleOauthButton />
	{/if}
</div>

<section class="mx-auto max-w-2xl px-4 py-8">
	{#each data.comments as thread}
		<div class="mb-6 rounded-lg bg-white p-4 shadow-sm">
			<div class="mb-3 flex items-center gap-3">
				<img
					class="h-10 w-10 rounded-full border-2 border-blue-500 object-cover"
					src={thread.comment.profile_picture}
					alt={`${thread.comment.username}'s avatar`}
				/>
				<h3 class="font-semibold text-gray-800">{thread.comment.username}</h3>
			</div>
			<p class="ml-14 leading-relaxed text-gray-700">{thread.comment.text}</p>

			{#if data.session}
				<div class="mt-3 ml-14">
					<div class="mt-3 flex items-center gap-2">
						<input
							type="text"
							bind:value={comment}
							placeholder="Write a reply..."
							class="min-h-10 min-w-0 flex-grow rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
						/>
						<button
							class="min-h-10 flex-shrink-0 rounded-md bg-blue-500 px-4 text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-blue-600"
							onclick={() =>
								postReply(
									{
										parentCommentId: thread.comment.id,
										textOriginal: comment as string,
										videoId
									},
									data.session?.access_token as string
								)}
						>
							Reply
						</button>
					</div>
				</div>
			{/if}

			{#if thread.replies && thread.replies.length > 0}
				<div class="mt-4 ml-14 border-t border-gray-200 pt-4">
					{#each thread.replies as reply}
						<div class="mb-3 flex items-center gap-3">
							<img
								class="h-8 w-8 rounded-full border border-gray-300 object-cover"
								src={reply.profile_picture}
								alt={`${reply.username}'s avatar`}
							/>
							<h4 class="font-medium text-gray-700">{reply.username}</h4>
						</div>
						<p class="mb-4 ml-11 text-gray-600">{reply.text}</p>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</section>
