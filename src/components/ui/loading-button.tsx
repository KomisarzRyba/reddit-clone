import { ReloadIcon } from '@radix-ui/react-icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { FC } from 'react';
import { VariantProps } from 'class-variance-authority';

interface LoadingButtonProps
	extends React.HTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}

export const LoadingButton: FC<LoadingButtonProps> = ({
	isLoading = false,
	children,
	...props
}) => {
	return (
		<Button disabled={isLoading} {...props}>
			{isLoading ? (
				<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
			) : null}
			{children}
		</Button>
	);
};
