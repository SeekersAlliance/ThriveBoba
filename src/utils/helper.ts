export const getBaseUrl = () =>
	1 ? '' : '/jackpot-boba';

export const formatAddress = (address: string, numbOfChar = 4) => {
	if (!address) {
		return '';
	}

	return address.slice(0, numbOfChar) + '...' + address.slice(-numbOfChar);
};
