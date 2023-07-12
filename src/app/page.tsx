import CustomFeed from '@/components/CustomFeed';
import GeneralFeed from '@/components/GeneralFeed';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { HomeIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function Home() {
	const session = await getAuthSession();
	return (
		<>
			<h1 className='font-bold text-3xl md:text-4xl'>Your feed</h1>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
				{/* feed */}
				{session ? <CustomFeed /> : <GeneralFeed />}
				{/* subreddit info */}
				<div className='overflow-hidden h-fit rounded-lg border border-border order-first md:order-last'>
					<div className='px-6 py-4 bg-accent'>
						<p className='font-semibold py-3 flex items-center gap-1.5'>
							<HomeIcon />
							Home
						</p>
					</div>
					<div className='-my-3 divide-y px-6 py-4 text-sm leading-6'>
						<div className='flex justify-between gap-x-4 py-3'>
							<p className='text-muted-foreground'>
								Your personal Chlebbit homepage. Come here to
								check in with your favorite communities.
							</p>
						</div>
						<Link
							className={buttonVariants({
								className: 'w-full mt-4 mb-6',
							})}
							href='/r/create'>
							Create Community
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
