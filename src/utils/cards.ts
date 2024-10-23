import { getBaseUrl } from './helper.ts';

const baseUrl = `${getBaseUrl()}/img/cards/`;
export enum CardType {
	none = 'none.png',
	single = 'single.png',
	small = 'small.png',
}

export const cardMap = {
	'1': 'bubble_gunner_',
	'2': 'meta_whelp_',
	'3': 'double_agent_',
	'4': 'morak_galahad_',
	'5': 'dragon_speaker_',
};

export const getCardImage = (cardId: number, cardType: CardType) => {
	return (
		baseUrl + cardMap[cardId.toString() as keyof typeof cardMap] + cardType
	);
};
