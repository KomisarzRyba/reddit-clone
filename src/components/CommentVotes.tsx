'use client';

import { VoteType } from '.prisma/client';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CommentVoteRequest } from '@/lib/validators/vote';
import { usePrevious } from '@mantine/hooks';
import { ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { CommentVote } from '@prisma/client';

interface CommentVotesProps {
	commentId: string;
	initialVotesAmt: number;
	initialVote?: Pick<CommentVote, 'type'>;
}

const CommentVotes: React.FC<CommentVotesProps> = ({
	commentId,
	initialVotesAmt,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const prevVote = usePrevious(currentVote);

	const { mutate: vote } = useMutation({
		mutationFn: async (type: VoteType) => {
			const payload: CommentVoteRequest = {
				commentId: commentId,
				voteType: type,
			};

			await axios.patch('/api/subreddit/post/comment/vote', payload);
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
			if (currentVote?.type === type) {
				setCurrentVote(undefined);
				if (type === 'UP') {
					setVotesAmt((prev) => prev - 1);
				} else if (type === 'DOWN') {
					setVotesAmt((prev) => prev + 1);
				}
			} else {
				setCurrentVote({ type });
				if (type === 'UP') {
					setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
				} else if (type === 'DOWN') {
					setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
				}
			}
		},
	});

	return (
		<div className='flex gap-1'>
			<Button
				size='sm'
				variant='ghost'
				aria-label='upvote'
				onClick={() => vote('UP')}>
				<ThickArrowUpIcon
					className={cn('w-5 h-5 text-slate-500', {
						'text-emerald-500 fill-emerald-500':
							currentVote?.type === 'UP',
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
						'text-red-500 fill-red-500':
							currentVote?.type === 'DOWN',
					})}
				/>
			</Button>
		</div>
	);
};

export default CommentVotes;
