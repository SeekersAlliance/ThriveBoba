import type { FC } from 'react';
import React, { useState } from 'react';
import Header from '../../components/Header/index.tsx';
import styled from 'styled-components';
import { getBaseUrl } from '../../utils/helper.ts';

import ProfitShare from './ProfitShare.tsx';
import Referrals from './Referrals.tsx';

enum TabId {
	Referrals,
	ProfitShare,
}

export const DashboardScreen: FC = () => {
	const [tabId, setTabId] = useState(TabId.Referrals);

	return (
		<Container>
			<Header />
			<Content>
				<TabGroup>
					<TabBtn
						$active={tabId === TabId.Referrals}
						onClick={() => setTabId(TabId.Referrals)}
					>
						Referrals
					</TabBtn>
					<TabBtn
						$active={tabId === TabId.ProfitShare}
						onClick={() => setTabId(TabId.ProfitShare)}
					>
						Early-Buyer Profit-Share
					</TabBtn>
				</TabGroup>
				<Referrals active={tabId === TabId.Referrals} />
				<ProfitShare active={tabId === TabId.ProfitShare} />
			</Content>
		</Container>
	);
};

export default DashboardScreen;

const Container = styled.div`
	flex-direction: column;
	align-items: center;
	height: 100vh;
`;

const Content = styled.div`
	flex-direction: column;
	max-width: 1200px;
	width: 100%;
	display: block;
`;

const TabGroup = styled.div`
	gap: 15px;
`;

const TabBtn = styled.div<{ $active: boolean }>`
	background-image: url(${({ $active }) =>
		$active
			? `${getBaseUrl()}/img/buttons/dashboard_tab_onpage.png`
			: `${getBaseUrl()}/img/buttons/dashboard_tab.png`});
	background-size: contain;
	background-repeat: no-repeat;
	width: 250px;
	aspect-ratio: 361 / 79;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	font-weight: 600;
	color: ${({ $active }) => ($active ? '#000' : '#fecd20')};
	user-select: none;
	cursor: pointer;
`;
