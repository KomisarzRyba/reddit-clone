import { Icons } from '@/components/Icons';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export const Navbar = () => {
	return (
		<nav className='fixed top-0 inset-x-0 h-fit py-2 bg-background z-10'>
			<div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
				<Link href='/' className='flex gap-2 items-center'>
					<Icons.logo className='w-8 h-8 sm:w-6 sm:h-6' />
					<p className='hidden text-sm font-medium sm:block'>
						Chlebbit
					</p>
				</Link>

				<Link href='/sign-in' className={buttonVariants()}>
					Sign In
				</Link>
			</div>
		</nav>
	);
};
