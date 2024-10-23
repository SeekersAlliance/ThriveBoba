const faucetEndpoint =
	'https://ps8st4im66.execute-api.ap-south-1.amazonaws.com/faucet';

export const requestFaucet = async (
	tokenAddress: string,
	toAddress: string,
	amount: number,
) => {
	if (!toAddress) return;

	return await fetch(faucetEndpoint, {
		method: 'POST',
		body: JSON.stringify({
			tokenAddress,
			toAddress,
			amount,
		}),
	});
};
