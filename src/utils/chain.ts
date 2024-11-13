// @ts-nocheck
import { proxy, snapshot } from 'valtio';
import type { EventLog } from 'web3';
import Web3 from 'web3';

import abiDraw from './abiDraw.json';
import abiFomo from './abiFomo.json';
import abiJackpot from './abiJackpot.json';
import abiMarketplace from './abiMarketplace.json';
import abiNFT from './abiNFT.json';
import abiReferral from './abiReferral.json';
import abiToken from './abiToken.json';
import { appState } from './state/index.ts';

export const opBNBChainTarget = {
	chainId: '0x15EB',
	chainName: 'opBNB Testnet',
	nativeCurrency: {
		symbol: 'tBNB',
		decimals: 18,
	},
	rpcUrls: ['https://opbnb-testnet-rpc.bnbchain.org'],
	blockExplorerUrls: ['https://opbnb-testnet.bscscan.com'],
};

export const getAccount = async () => {
	if (window.ethereum) {
		const accounts = await window.ethereum.request({
			method: 'eth_accounts',
		});

		if (accounts.length > 0) {
			appState.address = accounts[0];
		}

		await ensureNetworkTarget();
	}
};

export const connectWallet = async () => {
	if (window?.ethereum) {
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});

		if (accounts.length > 0) {
			appState.address = accounts[0];
		}

		await ensureNetworkTarget();
	}
};

export const ensureNetworkTarget = async () => {
	await window.ethereum?.request({
		method: 'wallet_addEthereumChain',
		params: [opBNBChainTarget],
	});
	await window.ethereum?.request({
		method: 'wallet_switchEthereumChain',
		params: [
			{
				chainId: opBNBChainTarget.chainId,
			},
		],
	});
};

export const handleAccountChanged = (accounts: string[]) => {
	appState.address = accounts[0];
	appState.referredAddress = undefined;
};

export enum SmartContract {
	Token = '0x69fBe552E6361A7620Bb2C106259Be301049E087',
	Marketplace = '0xe43BeE387e5d89c299730f7B7b581D35af753494',
	Draw = '0xe0320089466D923f3401F3b50CBEBE51Fba5C868',
	NFT = '0x49430AB34Dad2622b3327B57e517D22a2488E530',
	Jackpot = '0xBBda289cEe994B0927e45F9682faCAa1e1658916',
	Referral = '0xC8155eDB016b8Dd8863c77D4EE6015326F5b8a9d',
	Fomo = '0x227eebC2f5BBb3d636d3F7027690a01A3fbA38DD',
}

export const web3 = new Web3(window.ethereum);
// web3.eth.setProvider(opBNBChainTarget.rpcUrls[0]);
const web3Socket = new Web3(
	new Web3.providers.WebsocketProvider('wss://opbnb-testnet.publicnode.com'),
);

const loadContract = (abi: any, contract: SmartContract) => {
	return new web3.eth.Contract(abi, contract);
};

const marketplaceContract = loadContract(
	abiMarketplace,
	SmartContract.Marketplace,
);
const tokenContract = loadContract(abiToken, SmartContract.Token);
const nftContract = loadContract(abiNFT, SmartContract.NFT);
const jackpotContract = loadContract(abiJackpot, SmartContract.Jackpot);
const referralContract = loadContract(abiReferral, SmartContract.Referral);
const fomoContract = loadContract(abiFomo, SmartContract.Fomo);
const drawContract = loadContract(abiDraw, SmartContract.Draw);

export const faucetToken = async (address: string, amount: number) => {
	await tokenContract.methods.mint(address, amount * 10 ** 6).send({
		from: address,
	});
};

export const purchasePack = async (pack: number, card: number) => {
	const { address, referredAddress } = snapshot(appState);

	try {
		if (!address) throw new Error('Please connect wallet');

		const allowanceRequire = pack === 1 ? 100000000 : 10000000;
		const allowanceGrant = (await tokenContract.methods
			.allowance(address, SmartContract.Marketplace)
			.call()) as bigint;
		console.log(Number(allowanceGrant), '<<< allowance');
		console.log(allowanceRequire, '<<< required');
		const isAllowanceEnough = Number(allowanceGrant) >= allowanceRequire;
		console.log('allowance enough: ', isAllowanceEnough);
		if (!isAllowanceEnough) {
			await tokenContract.methods
				.approve(SmartContract.Marketplace, allowanceRequire)
				.send({ from: address });
		}
		console.log('account', address, pack, card, referredAddress || '0x0000000000000000000000000000000000000000');	
		const result = await marketplaceContract.methods
			.purchasePack(
				pack,
				card,
				referredAddress || '0x0000000000000000000000000000000000000000',
			)
			.send({
				from: address,
			});
		console.log('transaction', result);
		appState.transactionId = result.transactionHash;

		const requestIdHash = result.logs.find(
			(log) => log.address === SmartContract.Draw.toLowerCase(),
		)?.topics?.[1];

		if (requestIdHash) {
			const decString = web3.utils.hexToNumberString(requestIdHash);
			appState.requestId = decString;
		}

		return result;
	} catch (error) {
		console.log(error);
	}
};

export const subscribeDrawEvent = async () => {
	try {
		const drawContractWebsocket = new web3Socket.eth.Contract(
			abiDraw,
			SmartContract.Draw,
		);
		const subscription = drawContractWebsocket.events.RequestCompleted();
		subscription.on('data', async (event) => {
			console.log('draw event', event);
			const { requestId } = snapshot(appState);
			const compareRequestId =
				event.returnValues[0]?.toString() === requestId;

			if (compareRequestId) {
				const cardResult = (event.returnValues['ids'] as number[]).map(
					(value) => Number(value),
				);
				appState.cardResult = proxy(cardResult);
			}
			const tx = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', tx);
			getJackpotTotalValue();
		});
	} catch (error) {
		console.log(error);
	}
};

const nftIds = [4, 2, 3, 1, 5];

export const subscribeNftContractEvent = () => {
	const nftContractWebsocket = new web3Socket.eth.Contract(
		abiNFT,
		SmartContract.NFT,
	);
	nftContractWebsocket.events
		.TransferSingle({
			filter: {
				to: appState.address,
			},
		})
		.on('data', async (event) => {
			console.log('transfer single >>>', event);
			const receipt = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', receipt);
			await fetchNftIdList();
		});
	nftContractWebsocket.events
		.TransferBatch({
			filter: {
				to: appState.address,
			},
		})
		.on('data', async (event) => {
			console.log('transfer batch >>>', event);
			const receipt = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', receipt);
			await fetchNftIdList();
		});
	nftContractWebsocket.events
		.TransferBatch({
			filter: {
				from: appState.address,
			},
		})
		.on('data', async (event) => {
			console.log('burn cards >>>', event);
			const receipt = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', receipt);
			await fetchNftIdList();
		});
};

export const fetchNftIdList = async () => {
	const { address } = snapshot(appState);
	const nftBalance = await Promise.all(
		nftIds.map(async (nftId) => {
			return Number(
				await nftContract.methods.balanceOf(address, nftId).call(),
			);
		}),
	);
	console.log('nft balance', nftBalance);
	const nftIdList = nftBalance.reduce((list, balance, idx) => {
		const idFilledArray: number[] = Array(balance).fill(nftIds[idx]);
		return list.concat(idFilledArray);
	}, [] as number[]);
	console.log('fetch nft id list', nftIdList);
	appState.collectedNft = proxy(nftIdList);
};

export const getJackpotTotalValue = async () => {
	const result =
		Number(await jackpotContract.methods.getTotalValue().call()) / 10 ** 6;
	appState.jackpot = result;
};

export const claimJackpot = async () => {
	const { address } = snapshot(appState);
	const isApprovedAll = await nftContract.methods
		.isApprovedForAll(address, SmartContract.Jackpot)
		.call();
	if (!isApprovedAll) {
		await nftContract.methods
			.setApprovalForAll(SmartContract.Jackpot, true)
			.send({
				from: address,
			});
	}
	const result = await jackpotContract.methods.claim().send({
		from: address,
	});
	const jackpotClaimed =
		Number(web3.utils.hexToNumberString(result.logs[2].data as string)) /
		10 ** 6;
	console.log('transaction claim', result);
	appState.jackpotTxId = result.transactionHash;
	appState.jackpotClaimed = jackpotClaimed;
	getJackpotTotalValue();
};

export const getTotalReferral = async () => {
	const { address } = snapshot(appState);

	if (!address) return;

	const result = await referralContract.methods
		.getTotalReferralInfo(address)
		.call();
	const newReferralObj = {
		count: Number(result?.count || 0),
		amount: Number(result?.amount || 0),
		value: Number(result?.value || 0) / 10 ** 6 || 0,
	};
	appState.referral = { ...appState.referral, ...newReferralObj };
};

export const getReferralHistory = async () => {
	const { address } = snapshot(appState);

	if (!address) return;

	const result = (await referralContract.methods
		.getHistoryReferralInfo(address)
		.call()) as unknown[];
	appState.referral.history = [...result];
};

export const getProfitShareInfo = async () => {
	const { address } = snapshot(appState);
	await Promise.all([
		getTotalProfit(address),
		getClaimed(address),
		getUnclaim(address),
		(async () => {
			appState.profit.nextCardSoldProfit = await getPredict(address, 1);
		})(),
	]);
};

const getTotalProfit = async (address: string) => {
	const result = await fomoContract.methods.getTotalProfit(address).call();
	appState.profit.total = Number(result) / 10 ** 6;
};

const getClaimed = async (address: string) => {
	const result = await fomoContract.methods.getClaimed(address).call();
	appState.profit.claimed = Number(result) / 10 ** 6;
};

const getUnclaim = async (address: string) => {
	const result = await fomoContract.methods.getUnclaim(address).call();
	appState.profit.unclaim = Number(result) / 10 ** 6;
};

export const getPredict = async (address: string, numberOfCards: number) => {
	const result = await fomoContract.methods
		.getPredict(address, numberOfCards)
		.call();
	console.log('predict', result);
	return Number(result) / 10 ** 6;
};

export const claimProfit = async () => {
	const { address } = snapshot(appState);
	console.log('get claimed', fomoContract);

	const result = await fomoContract.methods.claim().send({
		from: address,
	});

	if (result) {
		getProfitShareInfo();
	}
};

export const fetchPastEvents = async () => {
	const jackpotEvents = (await jackpotContract.getPastEvents('JackpotClaim', {
		fromBlock: 0,
		toBlock: 'latest',
	})) as EventLog[];
	const filteredJackpotEvents = jackpotEvents.toSorted(
		(formerEvent, latterEvent) =>
			Number(latterEvent.blockNumber) - Number(formerEvent.blockNumber),
	);

	const drawEvents = (await drawContract.getPastEvents('RequestCompleted', {
		fromBlock: 0,
		toBlock: 'latest',
	})) as EventLog[];

	const filteredDrawEvent = drawEvents
		.filter((event) => {
			return (event.returnValues.ids as bigint[]).includes(4n);
		})
		.toSorted(
			(former, latter) =>
				Number(latter.blockNumber) - Number(former.blockNumber),
		);

	// console.log(jackpotEvents);
	// console.log(filteredDrawEvent);
	appState.latestEvents[0] = filteredJackpotEvents[0];
	appState.latestEvents[1] = filteredDrawEvent[0];
	appState.latestEvents[2] = filteredJackpotEvents[0];
	appState.latestEvents[3] = filteredDrawEvent[1];
	appState.latestEvents[4] = filteredJackpotEvents[0];
	appState.latestEvents[5] = filteredDrawEvent[0];
	appState.latestEvents[6] = filteredJackpotEvents[0];
	appState.latestEvents[7] = filteredDrawEvent[1];
};
