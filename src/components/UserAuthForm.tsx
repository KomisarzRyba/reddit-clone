'use client';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import React from 'react';
import { Icons } from './Icons';
import { LoadingButton } from './ui/loading-button';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const { toast } = useToast();

	const handleGoogleSignIn = async () => {
		setIsLoading(true);

		try {
			await signIn('google');
		} catch (error) {
			toast({
				title: 'Oops!',
				description:
					'Something went wrong while logging in with Google. Please try again.',
				variant: 'destructive',
				duration: 6000,
			});
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn('flex justify-center', className)} {...props}>
			<LoadingButton
				size='sm'
				className='w-full'
				isLoading={isLoading}
				onClick={handleGoogleSignIn}>
				{isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
				Google
			</LoadingButton>
		</div>
	);
};

export default UserAuthForm;
