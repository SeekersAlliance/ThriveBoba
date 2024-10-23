import type { FC } from 'react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { getBaseUrl } from '../../utils/helper.ts';

interface Props {
	children: string;
	onClick?: () => void;
}

export const TransactionBtn: FC<Props> = ({ children, onClick }) => {
	const [focus, setFocus] = useState(false);

	return (
		<Container
			onClick={onClick}
			$focus={focus}
			onMouseDown={() => setFocus(true)}
			onMouseUp={() => setFocus(false)}
		>
			{children}
		</Container>
	);
};

export default TransactionBtn;

const Container = styled.div<{ $focus: boolean }>`
	background-image: url('${getBaseUrl()}/img/buttons/transaction_id${({
		$focus,
	}) => ($focus ? '_click' : '')}.png');
	background-size: contain;
	background-position: center 5px;
	background-repeat: no-repeat;
	transform: translateY(-10px);
	align-items: center;
	justify-content: center;
	width: 400px;
	aspect-ratio: 224 / 31;
	cursor: pointer;
	user-select: none;
	font-size: 20px;
	font-weight: 600;
`;
