import { gzipSync } from 'zlib';
import { ARENA_STATS_BUCKET, ARENA_STATS_KEY_PREFIX } from '../common/config';
import { ArenaRunInfo, HighWinRunsInfo, TimePeriod } from '../model';
import { s3 } from './_build-final-stats';

export const saveHighWinRuns = async (runs: readonly ArenaRunInfo[], timePeriod: TimePeriod): Promise<void> => {
	const result: HighWinRunsInfo = {
		lastUpdated: new Date(),
		timePeriod: timePeriod,
		runs: runs,
	};
	const gzippedMinResult = gzipSync(JSON.stringify(result));
	await s3.writeFile(
		gzippedMinResult,
		ARENA_STATS_BUCKET,
		`${ARENA_STATS_KEY_PREFIX}/decks/${timePeriod}/overview.gz.json`,
		'application/json',
		'gzip',
	);
};
