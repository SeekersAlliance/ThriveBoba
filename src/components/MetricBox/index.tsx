import type { FC } from 'react';
import React from 'react';
import styled from 'styled-components';
import { getBaseUrl } from '../../utils/helper.ts';

interface Props {
	title: string;
	metric: string;
}

export const MetricBox: FC<Props> = ({ title, metric }) => {
	return (
		<Container>
			<Title>{title}:</Title>
			<Metric>{metric}</Metric>
		</Container>
	);
};

export default MetricBox;

const Container = styled.div`
	background-image: url('${getBaseUrl()}/img/pg9-10/dashboard_frame.png');
	background-size: contain;
	background-repeat: no-repeat;
	max-width: 400px;
	width: 100%;
	aspect-ratio: 527 / 257;
	flex-direction: column;
`;

const Title = styled.div`
	height: 19%;
	color: #fff;
	font-size: 20px;
	font-weight: 600;
	line-height: 22px;
	align-items: center;
	padding-left: 20px;
`;

const Metric = styled.div`
	height: 81%;
	color: #fff;
	font-size: 80px;
	font-weight: 700;
	line-height: 32px;
	align-items: center;
	justify-content: center;
`;
