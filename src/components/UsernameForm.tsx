'use client';

import { toast } from '@/hooks/use-toast';
import { UsernameRequest, UsernameValidator } from '@/lib/validators/username';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LoadingButton } from './ui/loading-button';

interface UsernameFormProps {
	user: Pick<User, 'id' | 'username'>;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ user }) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<UsernameRequest>({
		resolver: zodResolver(UsernameValidator),
		defaultValues: {
			name: user?.username || '',
		},
	});
	const router = useRouter();
	const { mutate: updateUsername, isLoading } = useMutation({
		mutationFn: async ({ name }: UsernameRequest) => {
			const payload: UsernameRequest = { name };
			const { data } = await axios.patch('api/username', payload);
			return data;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 409)
					return toast({
						title: 'Username already taken.',
						description: 'Please choose a different username.',
						variant: 'destructive',
					});
			}

			toast({
				title: 'There was an error.',
				description:
					'Could not change the username. Please try again later.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			toast({
				description: 'Your username has been updated!',
			});
			router.refresh();
		},
	});

	return (
		<form onSubmit={handleSubmit((e) => updateUsername(e))}>
			<Card>
				<CardHeader>
					<CardTitle>Your username</CardTitle>
					<CardDescription>
						Please enter a username you like.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='relative grid gap-1'>
						<div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
							<span className='text-sm text-muted-foreground'>
								u/
							</span>
						</div>
						<Label className='sr-only' htmlFor='name'>
							Name
						</Label>
						<Input
							id='name'
							className='w-[400px] pl-6'
							size={32}
							{...register('name')}
						/>
						{errors?.name && (
							<p className='px-1 text-xs text-destructive-foreground'>
								{errors.name.message}
							</p>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<LoadingButton isLoading={isLoading} disabled={isLoading}>
						Change name
					</LoadingButton>
				</CardFooter>
			</Card>
		</form>
	);
};

export default UsernameForm;
