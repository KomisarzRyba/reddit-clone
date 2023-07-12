'use client';

import { formatTimeToNow } from '@/lib/utils';
import { Comment, CommentVote, User } from '@prisma/client';
import React, { useRef, useState } from 'react';
import UserAvatar from './UserAvatar';
import CommentVotes from './CommentVotes';
import { Button } from './ui/button';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { LoadingButton } from './ui/loading-button';
import { useMutation } from '@tanstack/react-query';
import type { CommentRequest } from '@/lib/validators/comment';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

type ExtendedComment = Comment & {
	votes: CommentVote[];
	author: User;
};

interface CommentProps {
	comment: ExtendedComment;
	votesAmt: number;
	currentVote: CommentVote | undefined;
	postId: string;
}

const Comment: React.FC<CommentProps> = ({
	comment,
	currentVote,
	postId,
	votesAmt,
}) => {
	const commentRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { data: session } = useSession();
	const [isReplying, setIsReplying] = useState<boolean>(false);
	const [input, setInput] = useState<string>('');

	const { mutate: reply, isLoading } = useMutation({
		mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
			const payload: CommentRequest = {
				postId,
				text,
				replyToId,
			};
			const { data } = await axios.patch(
				'/api/subreddit/post/comment',
				payload
			);
			return data;
		},
		onError: () => {
			return toast({
				title: 'Something went wrong',
				description: 'Comment was not posted, please try again.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			router.refresh();
			setIsReplying(false);
		},
	});

	return (
		<div ref={commentRef} className='flex flex-col'>
			<div className='flex items-center'>
				<UserAvatar user={comment.author} className='w-6 h-' />
				<div className='ml-2 flex items-center gap-x-2'>
					<p className='text-sm font-medium'>
						u/{comment.author.username}
					</p>
					<p className='max-h-40 truncate text-xs text-muted-foreground'>
						{formatTimeToNow(comment.createdAt)}
					</p>
				</div>
			</div>
			<p className='text-sm mt-2'>{comment.text}</p>
			<div className='flex gap-2 items-center flex-wrap'>
				<CommentVotes
					commentId={comment.id}
					initialVotesAmt={votesAmt}
					initialVote={currentVote}
				/>
				<Button
					variant='ghost'
					size='sm'
					className='text-muted-foreground'
					onClick={() => {
						if (!session) return router.push('/sign-in');
						setIsReplying(!isReplying);
					}}>
					<ChatBubbleIcon className='w-4 h-4 mr-1.5' />
					Reply
				</Button>
				{isReplying ? (
					<div className='grid w-full gap-1.5'>
						<Label htmlFor='comment'>
							Replying to u/{comment.author.username}
						</Label>
						<div className='mt-2'>
							<Textarea
								id='comment'
								value={input}
								onChange={(e) => setInput(e.target.value)}
								rows={1}
								placeholder='What are your thoughts?'
							/>
							<div className='mt-2 flex justify-end gap-2'>
								<Button
									variant='ghost'
									tabIndex={-1}
									onClick={() => {
										setIsReplying(false);
										setInput('');
									}}>
									Cancel
								</Button>
								<LoadingButton
									isLoading={isLoading}
									disabled={input.length === 0}
									onClick={() => {
										if (!input) return;
										reply({
											postId,
											text: input,
											replyToId:
												comment.replyToId ?? comment.id,
										});
									}}>
									Post
								</LoadingButton>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Comment;
