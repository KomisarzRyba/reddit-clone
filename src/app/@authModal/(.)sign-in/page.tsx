import CloseModal from '@/components/CloseModal';
import SignIn from '@/components/SignIn';
import React from 'react';

const page: React.FC = () => {
	return (
		<div className='fixed inset-0 z-10 bg-slate-500/20'>
			<div className='container flex items-center h-full max-w-lg mx-auto'>
				<div className='relative w-full h-fit py-20 px-2 rounded-lg bg-popover'>
					<div className='absolute top-4 right-4'>
						<CloseModal />
					</div>
					<SignIn />
				</div>
			</div>
		</div>
	);
};

export default page;
