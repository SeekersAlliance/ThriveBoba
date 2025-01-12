// @ts-ignore
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
	connectWallet,
	getAccount,
	getJackpotTotalValue,
	handleAccountChanged,
	connectWeb3Auth,
} from '../../utils/chain.ts';
import { formatAddress, getBaseUrl } from '../../utils/helper.ts';
import { appState } from '../../utils/state/index.ts';
import { useSnapshot } from 'valtio';
import React from 'react';


declare global {
	interface Window {
		ethereum?: {
			request(arg0: { method: string; }): unknown;
			on: (event: string, handler: (accounts: string[]) => void) => void;
		};
	}
}

const domain = window.location.origin;

const tabs = [
	{
		link: '/',
		img: `${getBaseUrl()}/img/buttons/buy_cards.png`,
		imgActive: `${getBaseUrl()}/img/buttons/buy_cards_onpage.png`,
	},
	{
		link: '/inventory',
		img: `${getBaseUrl()}/img/buttons/inventory.png`,
		imgActive: `${getBaseUrl()}/img/buttons/inventory_onpage.png`,
	},
	{
		link: '/dashboard',
		img: `${getBaseUrl()}/img/buttons/dashboard.png`,
		imgActive: `${getBaseUrl()}/img/buttons/dashboard_onpage.png`,
	},
];

export const Header: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { address, jackpot } = useSnapshot(appState);
	const [focus, setFocus] = useState(false);
	const [connected, setConnected] = useState(!!address);

	useEffect(() => {
		const getInitialData = async () => {
			try {
				// await getAccount();
				await getJackpotTotalValue();
			}
			catch (err) {
				console.error(err);
			}
		}
		// const initWeb3Auth = async () => {
    //   try {
    //     await web3auth.initModal();
    //     // setProvider(web3auth.provider);

    //     if (web3auth.connected) {
    //       // setLoggedIn(true);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
		// initWeb3Auth();
		getInitialData();
		window.ethereum?.on('accountsChanged', (accounts: string[]) => {
			handleAccountChanged(accounts);
			navigate('/');
		});
		/* return () =>
			window.ethereum?.on('accountsChanged', handleAccountChanged); */
	}, []);

	useEffect(() => {
		appState.referralLink = `${domain}${getBaseUrl()}/referred/${address}`;
		setConnected(!!address);
	}, [address]);

	// const testlogin = async () => {
	// 	try{
	// 		const web3authProvider = await web3auth.connect();
	// 		// setProvider(web3authProvider);
	// 		console.log('web3authProvider', web3authProvider);
	// 		if (web3auth.connected) {
	// 			// setLoggedIn(true);
	// 			console.log('web3auth.connected', web3auth.connected);
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
  // };

	return (
		<Container>
			<div style={{ flex: 1 }}>
				<NavigateGroup>
					{tabs.map((tab) => {
						return (
							<img
								alt='tab'
								key={tab.link}
								src={
									location?.pathname === tab.link
										? tab.imgActive
										: tab.img
								}
								onClick={() => navigate(tab.link)}
							/>
						);
					})}
				</NavigateGroup>
			</div>
			<JackpotContainer>
				<Jackpot src={`${getBaseUrl()}/img/pg1-2/jackpot.png`} />
				<JackpotReward>{`$${jackpot}`}</JackpotReward>
			</JackpotContainer>
			<div style={{ flex: 1, justifyContent: 'flex-end' }}>
				{!connected ? (
					<ConnectWallet
						$focus={focus}
						onMouseDown={() => setFocus(true)}
						onMouseUp={() => setFocus(false)}
						// onClick={connectWallet}
						onClick={connectWeb3Auth}
					>
						Connect Wallet
					</ConnectWallet>
				) : (
					<div>
						<WalletGroup>
							{/* <div>
								<div />
							</div> */}
							<div>{formatAddress(address)}</div>
						</WalletGroup>
					</div>
				)}
			</div>
		</Container>
	);
};

export default Header;

const Container = styled.div`
	flex-direction: row;
	padding: 0 15px;
	width: 100%;
	justify-content: space-between;
	align-self: start;
	padding-bottom: 30px;
`;

const NavigateGroup = styled.div`
	gap: 15px;
	align-self: flex-start;
	margin-top: 15px;

	img {
		max-width: 100px;
		cursor: pointer;
	}
`;

const JackpotContainer = styled.div`
	flex: 1;
	justify-content: center;
	position: relative;
`;

const Jackpot = styled.img`
	max-width: 500px;
	aspect-ratio: 827 / 217;
	height: auto;
	object-fit: contain;
`;

const JackpotReward = styled.span`
	position: absolute;
	top: 40px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 32px;
	font-weight: 700;
	color: #fff;
`;

const ConnectWallet = styled.div<{ $focus: boolean }>`
	margin-top: 15px;
	width: 250px;
	aspect-ratio: 328 / 146;
	align-items: center;
	justify-content: center;
	background-image: url('${getBaseUrl()}/img/buttons/connect.png');
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	font-size: 25px;
	font-weight: 700;
	font-family: 'TitilliumWeb';
	align-self: flex-start;
	user-select: none;
	cursor: pointer;
	opacity: ${({ $focus }) => ($focus ? '0.5' : '1')};
	position: relative;
	transform: translateY(-30px);

	&:hover {
		background-image: url('${getBaseUrl()}/img/buttons/connect_hover.png');
	}
`;

const WalletGroup = styled.div`
	margin-top: 15px;
	gap: 15px;
	align-self: flex-start;

	div {
		background-color: #444;
		border-radius: 8px;
		flex: 1;
		color: #fff;
		width: 160px;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 20px;
		padding: 3px 15px;

		
	}
`;
