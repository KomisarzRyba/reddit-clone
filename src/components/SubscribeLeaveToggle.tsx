'use client';

import React, { startTransition } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoadingButton } from './ui/loading-button';

interface SubscribeLeaveToggleProps {
	isSubscribed: boolean;
	subredditId: string;
	subredditNmae: string;
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
	isSubscribed,
	subredditId,
	subredditNmae,
}) => {
	const { loginToast } = useCustomToast();
	const router = useRouter();

	const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				subredditId,
			};

			const { data } = await axios.post(
				'/api/subreddit/subscribe',
				payload
			);
			return data as string;
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'There was a problem',
				description: 'Something went wrong, please try again later.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: 'Subscribed',
				description: `You are now subscribed to r/${subredditNmae}`,
			});
		},
	});

	const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				subredditId,
			};

			const { data } = await axios.post(
				'/api/subreddit/unsubscribe',
				payload
			);
			return data as string;
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'There was a problem',
				description: 'Something went wrong, please try again later.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: 'Unsubscribed',
				description: `You left r/${subredditNmae}`,
			});
		},
	});

	return isSubscribed ? (
		<LoadingButton
			className='w-full mt-1 mb-4'
			onClick={() => unsubscribe()}
			isLoading={isUnsubLoading}>
			Leave community
		</LoadingButton>
	) : (
		<LoadingButton
			className='w-full mt-1 mb-4'
			onClick={() => subscribe()}
			isLoading={isSubLoading}>
			Join community
		</LoadingButton>
	);
};

export default SubscribeLeaveToggle;
