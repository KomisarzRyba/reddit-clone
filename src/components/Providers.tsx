'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './ThemeProvider';
import { SessionProvider } from 'next-auth/react';

const Providers = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem>
					{children}
				</ThemeProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
};

export default Providers;
