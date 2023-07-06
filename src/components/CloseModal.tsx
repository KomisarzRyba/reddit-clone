'use client';

import { Button } from './ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

const CloseModal = () => {
	const router = useRouter();

	return (
		<Button
			variant='ghost'
			className='w-12 h-12 rounded-md'
			aria-label='close modal'
			onClick={() => router.back()}>
			<Cross1Icon className='w-4 h-4' />
		</Button>
	);
};

export default CloseModal;
