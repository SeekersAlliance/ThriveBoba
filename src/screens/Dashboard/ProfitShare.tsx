import type { FC } from 'react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainBtn from '../../components/MainBtn/index.tsx';
import MetricBox from '../../components/MetricBox/index.tsx';
import styled from 'styled-components';
import { claimProfit, getPredict, getProfitShareInfo } from '../../utils/chain.ts';
import { getBaseUrl } from '../../utils/helper.ts';
import { appState } from '../../utils/state/index.ts';
import { useSnapshot } from 'valtio';

interface Props {
	active?: boolean;
}

export const ProfitShare: FC<Props> = ({ active = false }) => {
	const { address, profit } = useSnapshot(appState);
	const naviagte = useNavigate();
	const [cardAmount, setCardAmount] = useState(1);
	const [predictedProfit, setPredictedProfit] = useState(
		profit.nextCardSoldProfit,
	);
	useEffect(() => {
		if (address) {
			getProfitShareInfo();
		}
	}, [address]);

	useEffect(() => {
		const handlePredict = async () => {
			if (!address) return;
			const newPredictedProfit = await getPredict(address, cardAmount || 0);
			setPredictedProfit(newPredictedProfit);
		};

		handlePredict();
	}, [cardAmount, address]);

	return (
		<Container $active={active}>
			<Upper>
				<UpperLeft>
					<MetricBox
						title="Total Early-Buyer Profits Made"
						metric={`$${profit.total.toFixed(2)}`}
					/>
					<Claim>
						<div className="title claimed">Claimed:</div>
						<div className="value claimed">{`$${profit.claimed.toFixed(2)}`}</div>
						<div className="title unclaimed">Unclaimed:</div>
						<div className="value unclaimed">{`$${profit.unclaim.toFixed(2)}`}</div>
					</Claim>
					<MainBtn
						disabled={profit.unclaim < 0.01}
						onClick={claimProfit}
					>{`CLAIM $${profit.unclaim.toFixed(2)}!`}</MainBtn>
				</UpperLeft>
				<UpperRight>
					<div style={{ flex: 1, flexDirection: 'column' }}>
						<ProfitEstimate $direction="left">
							Approximate profit I will make on the next card sold:
							<span>{`$${profit.nextCardSoldProfit.toFixed(2)}`}</span>
						</ProfitEstimate>
						<SeparateLine />
						<CardsInput>
							If I buy:{' '}
							<input
								type={'number'}
								value={cardAmount.toString()}
								onChange={(event) => {
									const numberOfCards = Number(event.target.value);
									if (numberOfCards < 0) return;
									setCardAmount(numberOfCards);
								}}
							/>{' '}
							more cards...
						</CardsInput>
						<ProfitEstimate $direction="right">
							Approximate profit I will make on the next card sold:
							<span>{`$${predictedProfit.toFixed(2)}`}</span>
						</ProfitEstimate>
						<div
							style={{ justifyContent: 'center' }}
							onClick={() => naviagte('/')}
						>
							<MainBtn>BUY MORE CARDS!</MainBtn>
						</div>
					</div>
					<Character />
				</UpperRight>
			</Upper>
			<Lower>
				<div>
					<span>Early-Buyer Profit Sharing</span> is an incentive program where
					10% of each card’s purchase fee is evenly distributed to the
					purchasers of all cards sold before it. e.g. Buyer of Card2 gives 10%
					to buyer of Card1, and buyer of Card3 gives 5% to buyer of Card2 and
					5% to buyer of Card1. This incentivizes players to buy cards early and
					more cards. Program resets every season.
				</div>
			</Lower>
		</Container>
	);
};

export default ProfitShare;

const Container = styled.div<{ $active: boolean }>`
	width: 100%;
	padding: 15px 0;
	display: ${({ $active }) => ($active ? 'flex' : 'none')} !important;
	gap: 15px;
	flex-direction: column;
`;

const Upper = styled.div`
	gap: 20px;
`;

const UpperLeft = styled.div`
	gap: 30px;
	flex-direction: column;
`;

const Claim = styled.div`
	display: grid !important;
	grid-template-columns: 3fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 10px;

	div {
		font-size: 18px;
		font-weight: 700;
		align-items: center;

		&.title {
			padding-left: 15px;
		}

		&.value {
			justify-content: center;
		}

		&.claimed {
			background-color: #999;
		}

		&.unclaimed {
			background-color: #523a72;
			color: #fff;
		}
	}
`;

const UpperRight = styled.div`
	flex: 1;
	background-image: url('${getBaseUrl()}/img/pg11/profit_check_box.png');
	background-size: contain;
	background-repeat: no-repeat;
	aspect-ratio: 554 / 273;
	padding: 3px;
	padding-left: 25px;
`;

const ProfitEstimate = styled.div<{ $direction: string }>`
	color: #fff;
	font-weight: 600;
	font-size: 20px;
	padding: 15px 0;
	gap: 15px;
	align-items: flex-start;
	align-self: flex-start;
	margin-right: -50px;
	margin-bottom: -45px;

	span {
		align-self: flex-start;
		background-image: url('${getBaseUrl()}/img/pg11/chat_bubble_${({
			$direction,
		}) => $direction}.png');
		background-size: contain;
		background-repeat: no-repeat;
		aspect-ratio: 123 / 89;
		width: 200px;
		font-size: 40px;
		font-weight: 700;
		color: #000;
		display: flex;
		justify-content: center;
		position: relative;
		transform: translateY(-8px);
	}
`;

const SeparateLine = styled.div`
	background-image: url('${getBaseUrl()}/img/pg11/profit_check_line.png');
	aspect-ratio: 719 / 4;
	margin-right: -50px;
`;

const CardsInput = styled.div`
	gap: 15px;
	align-items: center;
	padding: 30px 0;
	color: #fff;
	font-weight: 600;
	font-size: 20px;

	input {
		font-size: 40px;
		width: 150px;
		text-align: center;

		&:focus-visible {
			outline: none;
		}
	}
`;

const Character = styled.div`
	background-image: url('${getBaseUrl()}/img/pg11/character.png');
	background-size: contain;
	background-position: bottom center;
	background-repeat: no-repeat;
	width: 300px;
`;

const Lower = styled.div`
	background-image: url('${getBaseUrl()}/img/pg11/desc_box.png');
	background-size: contain;
	aspect-ratio: 1667 / 165;
	padding: 15px 50px;
	justify-content: center;
	align-items: center;
	color: #fff;

	div {
		display: block !important;
		font-size: 17px;

		span {
			font-weight: 700;
		}
	}
`;
