import { S3 } from '@firestone-hs/aws-lambda-utils';
import { gzipSync } from 'zlib';
import { ARENA_STATS_BUCKET, ARENA_STATS_KEY_PREFIX } from '../common/config';
import { ArenaRunInfo, HighWinRunsInfo } from '../model';

export const saveHighWinRuns = async (runs: readonly ArenaRunInfo[], startDate: Date, s3: S3): Promise<void> => {
	const result: HighWinRunsInfo = {
		lastUpdated: new Date(),
		runs: [...runs],
		timePeriod: null,
	};
	const gzippedResult = gzipSync(JSON.stringify(result));
	const destination = `${ARENA_STATS_KEY_PREFIX}/decks/hourly/${startDate.toISOString()}.gz.json`;
	await s3.writeFile(gzippedResult, ARENA_STATS_BUCKET, destination, 'application/json', 'gzip');
};
