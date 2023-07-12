import { Icons } from '@/components/Icons';
import SearchBar from '@/components/SearchBar';
import UserAccountNav from '@/components/UserAccountNav';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const Navbar = async () => {
	const session = await getAuthSession();
	return (
		<nav className='fixed top-0 inset-x-0 h-fit py-4 z-10'>
			<div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-6'>
				<Link href='/' className='flex gap-2 items-center'>
					<Icons.logo className='w-8 h-8 sm:w-6 sm:h-6' />
					<p className='hidden text-sm font-medium sm:block'>
						Chlebbit
					</p>
				</Link>
				<SearchBar />
				{session?.user ? (
					<UserAccountNav user={session.user} />
				) : (
					<Link
						href='/sign-in'
						className={cn(buttonVariants(), 'min-w-fit')}>
						Sign In
					</Link>
				)}
			</div>
		</nav>
	);
};
