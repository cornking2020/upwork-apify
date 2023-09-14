const { log, splitUrl } = require('../tools');

exports.categoryParser = async ({ requestQueue, page }) => {
	log.debug('Category url...');

	await page.waitForSelector('#profiles-container .v5-tile');
	const profiles = await page.$$eval(
		'#profiles-container .v5-tile',
		($profiles) => {
			const data = [];
			$profiles.forEach(($profile) => {
				const profileUrl =
					$profile.querySelector('a[data-qa=name]').href;
				data.push(profileUrl);
			});

			return data;
		}
	);

	await profiles.reduce(async (previous, profileUrl) => {
		await previous;
		const url = splitUrl(profileUrl);
		await requestQueue.addRequest({ url });
	}, Promise.resolve());
};
