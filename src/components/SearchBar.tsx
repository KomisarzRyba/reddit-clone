'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Command,
	CommandInput,
	CommandItem,
	CommandList,
	CommandEmpty,
	CommandGroup,
} from './ui/command';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Prisma, Subreddit } from '.prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { PersonIcon } from '@radix-ui/react-icons';
import debounce from 'lodash.debounce';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = ({}) => {
	const [input, setInput] = useState<string>('');
	const router = useRouter();
	const {
		data: queryResults,
		refetch,
		isFetched,
		isFetching,
	} = useQuery({
		queryFn: async () => {
			if (!input) return [];
			const { data } = await axios.get(`/api/search?q=${input}`);
			return data as (Subreddit & {
				_count: Prisma.SubredditCountOutputType;
			})[];
		},
		queryKey: ['search-query'],
		enabled: false,
	});
	const request = debounce(async () => {
		refetch();
	}, 300);
	const debounceRequest = useCallback(() => {
		request();
	}, []);
	const commandRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(commandRef, () => {
		setInput('');
	});
	const pathname = usePathname();
	useEffect(() => {
		setInput('');
	}, [pathname]);

	return (
		<Command
			ref={commandRef}
			className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
			<CommandInput
				className='outline-none border-none focus:outline-none focus:border-none ring-0'
				placeholder='r/'
				value={input}
				onValueChange={(text) => {
					setInput(text);
					debounceRequest();
				}}></CommandInput>
			{input.length > 0 ? (
				<CommandList className='absolute bg-popover top-full inset-x-0 shadow rounded-b-md'>
					{isFetched && (
						<CommandEmpty>No results found.</CommandEmpty>
					)}
					{(queryResults?.length ?? 0) > 0 ? (
						<CommandGroup heading='Communities'>
							{queryResults?.map((subreddit) => (
								<CommandItem
									onSelect={(e) => {
										router.push(`/r/${e}`);
										router.refresh();
									}}
									key={subreddit.id}
									value={subreddit.name}>
									<PersonIcon className='mr-2 h-4 w-4' />
									<a href={`/r/${subreddit.name}`}>
										r/{subreddit.name}
									</a>
								</CommandItem>
							))}
						</CommandGroup>
					) : null}
				</CommandList>
			) : null}
		</Command>
	);
};

export default SearchBar;
