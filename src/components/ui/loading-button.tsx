import { Button, ButtonProps } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

interface LoadingButtonProps extends ButtonProps {
	isLoading?: boolean;
}

export const LoadingButton: FC<LoadingButtonProps> = ({
	isLoading = false,
	children,
	...props
}) => {
	return (
		<Button {...props}>
			{isLoading ? (
				<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
			) : null}
			{children}
		</Button>
	);
};
