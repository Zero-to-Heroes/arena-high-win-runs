import { S3 } from '@firestone-hs/aws-lambda-utils';
import { ARENA_STATS_BUCKET } from '../common/config';
import { buildFileKeys, buildFileNamesForGivenDay } from '../common/utils';
import { ArenaRunInfo, HighWinRunsInfo } from '../model';
import { persistHighWinRuns } from './persist-data';

export const handleHighWinRuns = async (targetDate: string, s3: S3) => {
	const fileNames = buildFileNamesForGivenDay(targetDate);
	const fileKeys = buildFileKeys('hourly', fileNames);
	const hourlyRawData: readonly string[] = await Promise.all(
		fileKeys.map((fileKey) => s3.readGzipContent(ARENA_STATS_BUCKET, fileKey, 1, false, 300)),
	);
	const hourlyData: readonly HighWinRunsInfo[] = hourlyRawData
		.filter((d) => !!d?.length)
		.map((data) => JSON.parse(data));
	if (!hourlyData?.length) {
		console.warn('no data found for', targetDate);
		return;
	}

	const allRunInfos: readonly ArenaRunInfo[] = hourlyData.flatMap((data) => data.runs);
	// targetDate + 1 day
	const lastUpdateDate = new Date(targetDate);
	lastUpdateDate.setDate(lastUpdateDate.getDate() + 1);
	const result: HighWinRunsInfo = {
		lastUpdated: lastUpdateDate,
		timePeriod: null,
		runs: [...allRunInfos],
	};
	await persistHighWinRuns(result, targetDate, s3);
};
