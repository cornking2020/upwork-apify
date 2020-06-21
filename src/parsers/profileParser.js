const Apify = require('apify');
const { log } = require('../tools');

exports.profileParser = async ({ page, request }) => {
    log.debug('Profile url...');

    await page.waitForFunction('window.PROFILE_RESPONSE !== null');
    const profileResponse = await page.evaluate(() => window.PROFILE_RESPONSE);
    const { profile, stats } = profileResponse.details.profile;
    const freelancer = {
        name: profile.name,
        location: profile.location,
        title: profile.title,
        description: profile.description,
        jobSuccess: stats.nSS100BwScore,
        hourlyRate: stats.hourlyRate,
        earned: stats.totalRevenue,
        numberOfJobs: stats.totalJobsWorked,
        hoursWorked: stats.totalHours,
        profileUrl: request.url,
    };

    await Apify.pushData(freelancer);
};
