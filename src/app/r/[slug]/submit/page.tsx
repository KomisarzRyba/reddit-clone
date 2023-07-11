import Editor from '@/components/Editor';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface pageProps {
	params: {
		slug: string;
	};
}

const page = async ({ params: { slug } }: pageProps) => {
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
	});

	if (!subreddit) return notFound();

	return (
		<div className='flex flex-col items-start gap-6'>
			<div className='border-b pb-5'>
				<div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
					<h3 className='ml-2 mt-2 text-base font-semibold leading-6'>
						Create Post
					</h3>
					<p className='ml-2 mt-2 truncate text-sm text-muted-foreground'>
						in r/{slug}
					</p>
				</div>
			</div>

			{/* form */}

			<Editor subredditId={subreddit.id} />

			<div className='w-full flex-auto justify-end'>
				<Button
					type='submit'
					form='subreddit-post-form'
					className='w-full'>
					Post
				</Button>
			</div>
		</div>
	);
};

export default page;
