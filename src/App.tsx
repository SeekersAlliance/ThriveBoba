import type { FC } from 'react';
import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import {
	createBrowserRouter,
	redirect,
	RouterProvider
} from 'react-router-dom';
import DashboardScreen from './screens/Dashboard/index.tsx';
import HomeScreen from './screens/Home.tsx';
import InventoryScreen from './screens/Inventory.tsx';
import ResultScreen from './screens/Result/index.tsx';
import {
	subscribeNftContractEvent,
	web3,
} from './utils/chain.ts';
import { getBaseUrl } from './utils/helper.ts';
import { appState } from './utils/state/index.ts';

export const router = createBrowserRouter(
	[
		{
			path: '/inventory',
			element: <InventoryScreen />,
		},
		{
			path: '/dashboard',
			element: <DashboardScreen />,
		},
		{
			path: '/result/:itemType',
			element: <ResultScreen />,
		},
		{
			path: '/referred/:referredAddress',
			loader: async ({ params }) => {
				const { referredAddress } = params;
				appState.referredAddress = referredAddress;
				return redirect('/');
			},
		},
		{
			path: '/',
			element: <HomeScreen />,
		},
	],
	{
		basename: getBaseUrl() || '/',
	},
);

export const App: FC = () => {
	useEffect(() => {
		
		const nftEvents = subscribeNftContractEvent();


		return () => {
			console.log('unsubscribing');
			nftEvents?.forEach((event:any) => event.unsubscribe());

		};
	}, []);
	return <RouterProvider router={router} />;
  // return (
  //   <Wrapper>
  //   <Title>
  //     Hello World!
  //   </Title>
  // </Wrapper>
  // );
};

export default App;
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;
