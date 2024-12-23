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

export const BobaSepoliaChainTarge = {
	chainId: '0x70d2',
	chainName: 'Boba Sepolia',
	nativeCurrency: {
		symbol: 'ETH',
		decimals: 18,
	},
	rpcUrls: ['https://sepolia.boba.network'],
	blockExplorerUrls: ['https://testnet.bobascan.com'],
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
		params: [BobaSepoliaChainTarge],
	});
	await window.ethereum?.request({
		method: 'wallet_switchEthereumChain',
		params: [
			{
				chainId: BobaSepoliaChainTarge.chainId,
			},
		],
	});
};

export const handleAccountChanged = (accounts: string[]) => {
	appState.address = accounts[0];
	appState.referredAddress = undefined;
};

export enum SmartContract {
	Token = '0xC4734D1D2c7CD7F8241A1a83816E27e2Dc6Fd1af',
	Marketplace = '0xCa24de3a05FDDBCA9F39dd02937cA86cD815A1f6',
	Draw = '0x354256aF8b725662E4411EBE178c47d1f97a509B',
	NFT = '0x46d657Ba75C5A1fd60b9E4dee64318Ff69e670fe',
	Jackpot = '0x22b605fC43AC6cAf517D02fA06AcF1a49ba860Ed',
	Referral = '0xDd866d81B0E56DBa8a5eAdC9A3787f411F3e3E3C',
	Fomo = '0xf0C8283157f9C6C59D34083D52955783a3F0414A',
}

export const web3 = new Web3(window.ethereum);
// web3.eth.setProvider(BobaSepoliaChainTarge.rpcUrls[0]);


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
		console.log('referral', referredAddress);
		const result = await marketplaceContract.methods
			.purchasePack(
				pack,
				card,
				referredAddress || '0x0000000000000000000000000000000000000000',
				[Math.floor(Math.random() * 1000000)]
			)
			.send({
				from: address,
			});
		console.log('transaction', result);
		appState.transactionId = result.transactionHash;
		


		const requestIdHash = result.logs.find(
			(log) => log.address === SmartContract.Draw.toLowerCase(),
		)?.topics?.[1];
		const logData = result.logs.filter(
			(log) => log.address === SmartContract.Draw.toLowerCase(),
		)[1].data;
		if (requestIdHash && logData) {
			console.log('logData', logData);
			const decoded = web3.eth.abi.decodeParameters(['uint256[]'], logData);

			console.log("Decoded Log:", decoded);
			const decString = web3.utils.hexToNumberString(requestIdHash);
			console.log('request id', decString);
			appState.requestId = decString;
			appState.cardResult = decoded[0].map((value) => Number(value));
		}

		return result;
	} catch (error) {
		console.log(error);
	}
};

export const getDrawEvent = async () => {
	const { requestId } = snapshot(appState);
	const maxRetries = 10;
	const interval = 1000;
	let attempts = 0;

	while (attempts < maxRetries) {
        try {
            console.log(`Attempt ${attempts + 1}/${maxRetries} to fetch events...`);

            const drawEvents = (await drawContract.getPastEvents('RequestCompleted', {
                fromBlock: 0,
                toBlock: 'latest',
            })) as EventLog[];

            const filteredDrawEvents = drawEvents.toSorted(
                (formerEvent, latterEvent) =>
                    Number(latterEvent.blockNumber) - Number(formerEvent.blockNumber),
            );

            console.log('Fetched draw events:', filteredDrawEvents);

            for (const event of filteredDrawEvents) {
                const compareRequestId = event.returnValues[0]?.toString() === requestId;
                if (compareRequestId) {
                    const cardResult = (event.returnValues['ids'] as number[]).map(
                        (value) => Number(value),
                    );
                    appState.cardResult = proxy(cardResult);
                    console.log('Found matching event, card result:', appState.cardResult);
					console.log('cardResult', cardResult);
                    return appState.cardResult;
                }
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
        attempts++;
    }

    console.warn('Max retries reached, no matching event found.');
    return null; // 沒有找到事件時返回 null
};

const nftIds = [4, 2, 3, 1, 5];

export const subscribeNftContractEvent = () => {
	console.log('subscribe nft contract event');
	try{
		const nftEvent = nftContract.events.TransferSingle({
			filter: {
				to: appState.address,
			},
		})
		nftEvent.on('data', async (event) => {
			console.log('transfer single >>>', event);
			const receipt = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', receipt);
			await fetchNftIdList();
		});
		const nftEvent2 = nftContract.events.TransferBatch({
			filter: {
				to: appState.address,
			},
		})
		nftEvent2.on('data', async (event) => {
			console.log('transfer batch >>>', event);
			const receipt = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', receipt);
			await fetchNftIdList();
		});
		const nftEvent3 = nftContract.events.TransferBatch({
			filter: {
				from: appState.address,
			},
		})
		nftEvent3.on('data', async (event) => {
			console.log('burn cards >>>', event);
			const receipt = await web3.eth.getTransaction(
				event.transactionHash as string,
			);
			console.log('transaction', receipt);
			await fetchNftIdList();
		});
		return [nftEvent, nftEvent2, nftEvent3];
	}catch(error){
		console.log(error);
	}
	// const nftContractWebsocket = new web3Socket.eth.Contract(
	// 	abiNFT,
	// 	SmartContract.NFT,
	// );
	// nftContractWebsocket.events
	// 	.TransferSingle({
	// 		filter: {
	// 			to: appState.address,
	// 		},
	// 	})
	// 	.on('data', async (event) => {
	// 		console.log('transfer single >>>', event);
	// 		const receipt = await web3.eth.getTransaction(
	// 			event.transactionHash as string,
	// 		);
	// 		console.log('transaction', receipt);
	// 		await fetchNftIdList();
	// 	});
	// nftContractWebsocket.events
	// 	.TransferBatch({
	// 		filter: {
	// 			to: appState.address,
	// 		},
	// 	})
	// 	.on('data', async (event) => {
	// 		console.log('transfer batch >>>', event);
	// 		const receipt = await web3.eth.getTransaction(
	// 			event.transactionHash as string,
	// 		);
	// 		console.log('transaction', receipt);
	// 		await fetchNftIdList();
	// 	});
	// nftContractWebsocket.events
	// 	.TransferBatch({
	// 		filter: {
	// 			from: appState.address,
	// 		},
	// 	})
	// 	.on('data', async (event) => {
	// 		console.log('burn cards >>>', event);
	// 		const receipt = await web3.eth.getTransaction(
	// 			event.transactionHash as string,
	// 		);
	// 		console.log('transaction', receipt);
	// 		await fetchNftIdList();
	// 	});
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

	console.log(filteredJackpotEvents);
	console.log(filteredDrawEvent);
	appState.latestEvents[0] = filteredJackpotEvents[0];
	appState.latestEvents[1] = filteredDrawEvent[0];
	appState.latestEvents[2] = filteredJackpotEvents[0];
	appState.latestEvents[3] = filteredDrawEvent[1];
	appState.latestEvents[4] = filteredJackpotEvents[0];
	appState.latestEvents[5] = filteredDrawEvent[0];
	appState.latestEvents[6] = filteredJackpotEvents[0];
	appState.latestEvents[7] = filteredDrawEvent[1];
};
