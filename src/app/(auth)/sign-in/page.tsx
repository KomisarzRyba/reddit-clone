import SignIn from '@/components/SignIn';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

const SignInPage: React.FC = () => {
	return (
		<div className='absolute inset-0'>
			<div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
				<Link
					href='/'
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'self-start -mt-20'
					)}>
					<ChevronLeftIcon className='w-4 h-4 mr-2' />
					Home
				</Link>
				<SignIn />
			</div>
		</div>
	);
};

export default SignInPage;
