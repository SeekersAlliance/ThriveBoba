import React, { type FC, useState } from 'react';
import styled from 'styled-components';
import { getBaseUrl } from '../../utils/helper.ts';

interface Props {
	children: string;
	onClick?: () => void;
}

export const FaucetBtn: FC<Props> = ({ children, onClick }) => {
	const [focus, setFocus] = useState(false);

	return (
		<Container
			$focus={focus}
			onClick={onClick}
			onMouseDown={() => setFocus(true)}
			onMouseUp={() => setFocus(false)}
		>
			{children}
		</Container>
	);
};

export default FaucetBtn;

const Container = styled.div<{ $focus: boolean }>`
	background-image: url('${getBaseUrl()}/img/buttons/${({ $focus }) =>
		$focus ? 'faucet_click.png' : 'faucet.png'}');
	background-size: contain;
	background-position: 5px 5px;
	font-family: 'TitilliumWeb';
	font-weight: 700;
	font-size: 20px;
	width: 250px;
	aspect-ratio: 354 / 93;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: pointer;
`;
