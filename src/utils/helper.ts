export const getBaseUrl = () =>
	process.env.NODE_ENV === 'development' ? '' : '/jackpot';

export const formatAddress = (address: string, numbOfChar = 4) => {
	if (!address) {
		return '';
	}

	return address.slice(0, numbOfChar) + '...' + address.slice(-numbOfChar);
};
