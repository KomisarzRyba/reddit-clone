import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/lib/db';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';
import { Post, User, Vote } from '@prisma/client';
import {
	ReloadIcon,
	ThickArrowDownIcon,
	ThickArrowUpIcon,
} from '@radix-ui/react-icons';
import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

interface PageProps {
	params: {
		postId: string;
	};
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const page = async ({ params }: PageProps) => {
	const cachedPost = (await kv.hgetall(
		`post:${params.postId}`
	)) as CachedPost;
	let post: (Post & { votes: Vote[]; author: User }) | null = null;
	if (!cachedPost) {
		post = await db.post.findFirst({
			where: {
				id: params.postId,
			},
			include: {
				votes: true,
				author: true,
			},
		});
	}

	if (!post && !cachedPost) return notFound();

	return (
		<div>
			<div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
				<Suspense fallback={<PostVoteShell />}>
					<PostVoteServer
						postId={post?.id ?? cachedPost.id}
						getData={async () => {
							return await db.post.findUnique({
								where: {
									id: params.postId,
								},
								include: {
									votes: true,
								},
							});
						}}
					/>
				</Suspense>
				<div className='sm:w-0 w-full flex-1 p-4 rounded-sm'>
					<p className='max-h-4 mt-1 truncate text-xs text-muted-foreground'>
						Posted by u/
						{post?.author.username ??
							cachedPost.authorUsername}{' '}
						{formatTimeToNow(
							new Date(post?.createdAt ?? cachedPost.createdAt)
						)}
					</p>
					<h1 className='text-xl font-semibold py-2 leading-6'>
						{post?.title ?? cachedPost.title}
					</h1>
					<EditorOutput
						content={post?.content ?? cachedPost.content}
					/>
				</div>
			</div>
		</div>
	);
};

const PostVoteShell = () => {
	return (
		<div className='flex items-center flex-col pr-6 w-20'>
			<div className={buttonVariants({ variant: 'ghost' })}>
				<ThickArrowUpIcon className='w-5 h-5 text-muted-foreground' />
			</div>
			<div className='text-center py-2 font-medium text-sm'>
				<ReloadIcon className='w-3 h-3 animate-spin' />
			</div>
			<div className={buttonVariants({ variant: 'ghost' })}>
				<ThickArrowDownIcon className='w-5 h-5 text-muted-foreground' />
			</div>
		</div>
	);
};

export default page;
