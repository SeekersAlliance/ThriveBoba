import type { FC } from 'react';
import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import {
	createBrowserRouter,
	redirect,
	RouterProvider,
	createHashRouter,
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

export const routerBrowser = createBrowserRouter(
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
				console.log(referredAddress, '<<< I change the referred address');
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

// const routerHash = createHashRouter([
//     {
//         path: '/referred/:referredAddress',
//         loader: async ({ params }) => {
//             const { referredAddress } = params;
//             appState.referredAddress = referredAddress;
//             console.log('referredAddress', referredAddress);
//             const newUrl = window.location.href.split('#')[0];
// 						console.log('newUrl', newUrl);
//             window.history.replaceState(null, '', newUrl); 
//         },
//     },
// ]);

export const App: FC = () => {
	useEffect(() => {
		const nftEvents = subscribeNftContractEvent();
		return () => {
			console.log('unsubscribing');
			nftEvents?.forEach((event:any) => event.unsubscribe());

		};
	}, []);
	console.log(appState.referredAddress, '<<< referred address log in app');
	return <RouterProvider router={routerBrowser} />;
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
