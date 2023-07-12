import { SEARCH_RESULTS_DISPLAY_COUNT } from '@/config';
import { db } from '@/lib/db';

export async function GET(req: Request) {
	const url = new URL(req.url);
	const q = url.searchParams.get('q');
	if (!q) return new Response('Invalid query', { status: 400 });
	const results = await db.subreddit.findMany({
		where: {
			name: {
				startsWith: q,
			},
		},
		include: {
			_count: true,
		},
		take: SEARCH_RESULTS_DISPLAY_COUNT,
	});
	return new Response(JSON.stringify(results));
}
