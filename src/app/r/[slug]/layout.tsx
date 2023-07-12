import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

const layout = async ({
	children,
	params: { slug },
}: {
	children: ReactNode;
	params: { slug: string };
}) => {
	const session = await getAuthSession();
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					subreddit: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  });

	const isSubscribed = !!subscription;

	if (!subreddit) return notFound();

	const memberCount = await db.subscription.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	});

	return (
		<div className='sm:container max-w-7xl mx-auto h-full pt-12'>
			<div className=''>
				{/* back button */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
					<div className='flex flex-col col-span-2 space-y-6'>
						{children}
					</div>
					{/* info sidebar */}
					<div className='overflow-hidden h-fit rounded-lg border order-first md:order-last'>
						<div className='px-6 py-4'>
							<p className='font-semibold py-3'>
								About r/{subreddit.name}
							</p>
						</div>
						<dl className='divide-y px-6 py-4 text-sm leading-6'>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-muted-foreground'>
									Created
								</dt>
								<dd className='text-muted-foreground'>
									<time
										dateTime={subreddit.createdAt.toDateString()}>
										{format(
											subreddit.createdAt,
											'MMMM d, yyyy'
										)}
									</time>
								</dd>
							</div>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-muted-foreground'>
									Members
								</dt>
								<dd className='text-muted-foreground'>
									<div className='text-muted-foreground'>
										{memberCount}
									</div>
								</dd>
							</div>

							{subreddit.creatorId === session?.user.id ? (
								<div className='flex justify-between gap-x-4 py-3'>
									<p className='text-muted-foreground'>
										You are the creator of this community
									</p>
								</div>
							) : null}

							{subreddit.creatorId !== session?.user.id ? (
								<SubscribeLeaveToggle
									isSubscribed={isSubscribed}
									subredditId={subreddit.id}
									subredditNmae={subreddit.name}
								/>
							) : null}

							<Link
								href={`/r/${slug}/submit`}
								className={buttonVariants({
									variant: 'outline',
									className: 'w-full mb-6',
								})}>
								Create Post
							</Link>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default layout;
