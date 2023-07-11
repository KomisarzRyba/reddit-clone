'use client';

import { VoteType } from '.prisma/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { usePrevious } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

interface PostVoteClientProps {
	postId: string;
	initialVotesAmt: number;
	initialVote?: VoteType | null;
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({
	postId,
	initialVotesAmt,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const prevVote = usePrevious(currentVote);

	useEffect(() => {
		setCurrentVote(initialVote);
	}, [initialVote]);

	const { mutate: vote } = useMutation({
		mutationFn: async (type: VoteType) => {
			const payload: PostVoteRequest = {
				postId: postId,
				voteType: type,
			};

			await axios.patch('/api/subreddit/post/vote', payload);
		},
		onError: (err, voteType) => {
			if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
			else setVotesAmt((prev) => prev + 1);

			setCurrentVote(prevVote);

			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'Something went wrong',
				description: 'Your vote was not registered, please try again.',
				variant: 'destructive',
			});
		},
		onMutate: (type: VoteType) => {
			if (currentVote === type) {
				setCurrentVote(undefined);
				if (currentVote === 'UP') {
					setVotesAmt((prev) => prev - 1);
				} else if (currentVote === 'DOWN') {
					setVotesAmt((prev) => prev + 1);
				}
			} else {
				setCurrentVote(type);
				if (type === 'UP') {
					setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
				} else if (type === 'DOWN') {
					setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
				}
			}
		},
	});

	return (
		<div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
			<Button
				size='sm'
				variant='ghost'
				aria-label='upvote'
				onClick={() => vote('UP')}>
				<ThickArrowUpIcon
					className={cn('w-5 h-5 text-slate-500', {
						'text-emerald-500 fill-emerald-500':
							currentVote === 'UP',
					})}
				/>
			</Button>
			<p className='text-center py-2 font-medium text-sm text-slate-500'>
				{votesAmt}
			</p>
			<Button
				size='sm'
				variant='ghost'
				aria-label='downvote'
				onClick={() => vote('DOWN')}>
				<ThickArrowDownIcon
					className={cn('w-5 h-5 text-slate-500', {
						'text-red-500 fill-red-500': currentVote === 'DOWN',
					})}
				/>
			</Button>
		</div>
	);
};

export default PostVoteClient;
