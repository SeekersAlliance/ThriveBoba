import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/index.tsx';
import MainBtn from '../components/MainBtn/index.tsx';
import styled from 'styled-components';
import { CardType, getCardImage } from '../utils/cards.ts';
import { claimJackpot, fetchNftIdList } from '../utils/chain.ts';
import { getBaseUrl } from '../utils/helper.ts';
import { appState } from '../utils/state/index.ts';
import { useSnapshot } from 'valtio';

export const InventoryScreen: FC = () => {
	const navigate = useNavigate();
	const { address, jackpot, jackpotTxId, jackpotClaimed, collectedNft } =
		useSnapshot(appState);
	const [collectedIds, setCollectedIds] = useState<number[]>(
		Array.from(new Set(collectedNft)),
	);
	const [modalDisplay, setModalDisplay] = useState(false);
	useEffect(() => {
		address && fetchNftIdList();
	}, [address]);

	useEffect(() => {
		const newCollectedIds = Array.from(new Set(collectedNft));
		setCollectedIds(newCollectedIds);
	}, [collectedNft]);

	useEffect(() => {
		console.log('jackpot prize', jackpot);
		if (jackpotTxId) setModalDisplay(true);
	}, [jackpotTxId]);

	useEffect(() => {
		return () => {
			appState.jackpotTxId = '';
			appState.jackpotClaimed = 0;
		};
	}, []);

	return (
		<Container>
			<Header />
			<Title>INVENTORY</Title>
			<Collection>
				<h3>Collect all 5 cards to win Jackpot!</h3>
				<div>
					{[4, 2, 3, 1, 5].map((value, idx) => {
						const cardType = collectedIds.some(
							(cardId) => cardId === value,
						)
							? CardType.small
							: CardType.none;
						const cardImgSrc = getCardImage(value, cardType);
						return <Card key={idx} src={cardImgSrc} />;
					})}
				</div>
				<MainBtn
					isLong={true}
					disabled={!(collectedIds.length === 5 && jackpot > 0)}
					onClick={claimJackpot}
				>
					BURN CARDS TO CLAIM JACKPOT!
				</MainBtn>
				<span>{`${collectedIds.length}/5 Cards Collected`}</span>
			</Collection>
			<CardInWallet>
				{collectedNft.map((cardId, idx) => {
					const cardImgSrc = getCardImage(cardId, CardType.small);
					return <Card key={idx} src={cardImgSrc} />;
				})}
			</CardInWallet>
			<ModalContainer $display={modalDisplay}>
				<ModalContent>
					<CloseBtn onClick={() => navigate('/', { replace: true })} />
					<ModalTitle>CONGRATULATIONS!</ModalTitle>
					<ModalSubtitle>{`You've collected all 5 cards & won the $${jackpotClaimed} JACKPOT!!`}</ModalSubtitle>
					<CoinS src={`${getBaseUrl()}/img/pg6-7/S_icon_glow.png`} />
					<BtnContainer>
						<MainBtn
							isLong
							onClick={() =>
								window.open(
									`https://testnet.bobascan.com//tx/${jackpotTxId}`,
									'_blank',
								)
							}
						>
							JACKPOT TRANSACTION ID
						</MainBtn>
					</BtnContainer>
				</ModalContent>
			</ModalContainer>
		</Container>
	);
};

export default InventoryScreen;

const Container = styled.div`
	flex-direction: column;
	align-items: center;
	height: 100vh;
`;

const Title = styled.h1`
	font-size: 40px
	font-weight: 700;
	color: #fff;
`;

const Collection = styled.div`
	margin-top: 30px;
	background-image: url('${getBaseUrl()}/img/pg6-7/inventory_frame.png');
	background-size: contain;
	background-repeat: no-repeat;
	max-width: 1200px;
	aspect-ratio: 226 / 75;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 20px 0;
	position: relative;

	h3 {
		text-align: center;
		color: #fff;
		font-size: 20px;
		font-weight: 700;
	}

	span {
		position: absolute;
		bottom: 15px;
		right: 25px;
		color: #fff;
	}
`;

const Card = styled.img`
	width: 180px;
	aspect-ratio: 301 / 449;
`;

const CardInWallet = styled.div`
	flex-wrap: wrap;
	max-width: 1080px;
`;

const ModalContainer = styled.div<{ $display: boolean }>`
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	justify-content: center;
	z-index: 0;
	display: ${({ $display }) => ($display ? 'flex' : 'none')} !important;
`;

const ModalContent = styled.div`
	position: relative;
	align-self: center;
	width: 70%;
	height: 69vh;
	flex-direction: column;
	z-index: 1;

	&:before {
		content: '';
		background-color: #241a30;
		opacity: 0.97;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 0;
	}
`;

const CloseBtn = styled.div`
	background-image: url('${getBaseUrl()}/img/pg6-7/close_ic.svg');
	background-size: contain;
	width: 40px;
	margin: 10px 10px 0 0;
	aspect-ratio: 1;
	align-self: flex-end;
	z-index: 2;
	cursor: pointer;
`;

const ModalTitle = styled.h1`
	text-align: center;
	color: gold;
	z-index: 2;
	font-size: 40px;
`;

const ModalSubtitle = styled.p`
	text-align: center;
	color: #fff;
	z-index: 2;
	font-size: 26px;
	font-weight: 600;
	margin: 0;
`;

const CoinS = styled.img`
	z-index: 2;
	width: 320px;
	aspect-ratio: 1;
	align-self: center;
`;

const BtnContainer = styled.div`
	z-index: 2;
	justify-content: center;
`;
