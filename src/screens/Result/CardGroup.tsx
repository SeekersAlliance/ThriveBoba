import type { FC } from 'react';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CardType, getCardImage } from '../../utils/cards.ts';
import { appState } from '../../utils/state/index.ts';
import { proxy } from 'valtio';
import { getDrawEvent } from '../../utils/chain.ts';

interface Props {
	cardIds: readonly number[];
}

export const CardGroup: FC<Props> = ({ cardIds }) => {
	const [loading, setLoading] = useState(true);
	const isSingleCard = cardIds.length === 1;
	const [rowOne, rowTwo] = [cardIds.slice(0, 5), cardIds.slice(5)];
	useEffect(() => {
		if (cardIds.length > 0) {
			setLoading(false);
		}
	}, [cardIds]);

	useEffect(() => {
		const getResults = async () => {
			await getDrawEvent();
		}
		// getResults();
		return () => {
			appState.cardResult = proxy([]);
		};
	}, []);

	return (
		<Container>
			{loading ? (
				<p style={{ color: 'white', fontSize: 40 }}>Loading...</p>
			) : (
				<Fragment>
					{isSingleCard ? (
						<SingleCard
							src={getCardImage(cardIds[0], CardType.single)}
						/>
					) : (
						<Fragment>
							<CardRow>
								{rowOne.map((cardId, idx) => (
									<SmallCard
										key={idx}
										src={getCardImage(
											cardId,
											CardType.small,
										)}
									/>
								))}
							</CardRow>
							<CardRow className="row-two">
								{rowTwo.map((cardId, idx) => (
									<SmallCard
										key={idx}
										src={getCardImage(
											cardId,
											CardType.small,
										)}
									/>
								))}
							</CardRow>
						</Fragment>
					)}
				</Fragment>
			)}
		</Container>
	);
};

export default CardGroup;

const Container = styled.div`
	flex-direction: column;
	justify-content: center;
	flex: 1;
	align-self: center;
	max-height: 75vh;
`;

const SingleCard = styled.img`
	max-height: 80%;
`;

const CardRow = styled.div`
	gap: 10px;
	justify-content: center;
	max-height: 45%;

	&.row-two {
		transform: translateY(-30px);
	}
`;

const SmallCard = styled.img`
	max-height: 100%;
`;
