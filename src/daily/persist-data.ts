import { S3 } from '@firestone-hs/aws-lambda-utils';
import { gzipSync } from 'zlib';
import { ARENA_STATS_BUCKET, ARENA_STATS_KEY_PREFIX } from '../common/config';
import { HighWinRunsInfo } from '../model';

export const persistHighWinRuns = async (data: HighWinRunsInfo, targetDateStr: string, s3: S3) => {
	const targetDate = new Date(targetDateStr);
	targetDate.setHours(0);
	targetDate.setMinutes(0);
	targetDate.setSeconds(0);
	targetDate.setMilliseconds(0);
	// The date in the format YYYY-MM-ddTHH:mm:ss.sssZ
	const startDate = targetDate.toISOString();

	const gzippedMinResult = gzipSync(JSON.stringify(data));
	const destination = `${ARENA_STATS_KEY_PREFIX}/decks/daily/${startDate}.gz.json`;
	await s3.writeFile(gzippedMinResult, ARENA_STATS_BUCKET, destination, 'application/json', 'gzip');
};
