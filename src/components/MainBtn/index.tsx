import { type FC, useState } from 'react';
import React from 'react';
import styled from 'styled-components';
import { getBaseUrl } from '../../utils/helper.ts';

interface Props {
	children: string;
	onClick?: () => void;
	tag?: string;
	isLong?: boolean;
	disabled?: boolean;
}

export const MainBtn: FC<Props> = ({
	children,
	onClick,
	tag,
	isLong = false,
	disabled = false,
}) => {
	const [focus, setFocus] = useState(false);
	const hasTag = !!tag;
	const handleClick = disabled
		? () => {
				console.log('disabled');
			}
		: onClick;

	return (
		<Container
			onMouseDown={() => setFocus(true)}
			onMouseUp={() => setFocus(false)}
			onClick={handleClick}
		>
			{hasTag && <Tag>{tag}</Tag>}
			<Button $focus={focus} $isLong={isLong} $disabled={disabled}>
				{children}
			</Button>
		</Container>
	);
};

export default MainBtn;

const Container = styled.div`
	flex-direction: column;
	align-items: flex-end;
`;

const Tag = styled.div`
	background-image: url('${getBaseUrl()}/img/buttons/main_tag.png');
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center 2px;
	width: 190px;
	aspect-ratio: 237 / 33;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	font-weight: 700;
	color: #fff;
	position: relative;
	transform: translateX(20px);
`;

const Button = styled.div<{
	$focus: boolean;
	$isLong: boolean;
	$disabled: boolean;
}>`
	background-image: url('${getBaseUrl()}/img/buttons/${({
		$focus,
		$isLong,
		$disabled,
	}) => {
		const prefix = $isLong ? 'main_long' : 'main';
		return $disabled
			? `${prefix}_unavailable.png`
			: $focus
				? `${prefix}_click.png`
				: `${prefix}.png`;
	}}');
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center 3px;
	width: ${({ $isLong }) => ($isLong ? '600px' : '380px')};
	aspect-ratio: ${({ $isLong }) => ($isLong ? 798 / 59 : 455 / 59)};
	align-items: center;
	justify-content: center;
	font-size: 28px;
	font-weight: 700;
	font-family: 'TitilliumWeb';
	user-select: none;
	${({ $disabled }) =>
		$disabled ? 'pointer-event: none;' : 'cursor: pointer;'}
`;
