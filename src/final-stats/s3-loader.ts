/* eslint-disable no-case-declarations */
import { PatchInfo } from '@firestone-hs/aws-lambda-utils';
import { ARENA_STATS_BUCKET } from '../common/config';
import { getFileKeysToLoad } from '../common/utils';
import { HighWinRunsInfo, TimePeriod } from '../model';
import { s3 } from './_build-final-stats';

export const loadDailyHighWinRunsFromS3 = async (
	timePeriod: TimePeriod,
	patchInfo: PatchInfo,
): Promise<readonly HighWinRunsInfo[]> => {
	const fileKeys = getFileKeysToLoad(timePeriod, patchInfo);
	const rawData: readonly string[] = await Promise.all(
		fileKeys.map((fileKey) => s3.readGzipContent(ARENA_STATS_BUCKET, fileKey, 1, false, 300)),
	);
	const data: readonly HighWinRunsInfo[] = rawData.filter((d) => !!d?.length).map((data) => JSON.parse(data));
	return data;
};
