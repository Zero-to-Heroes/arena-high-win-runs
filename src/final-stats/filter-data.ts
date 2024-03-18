import { groupByFunction } from '@firestone-hs/aws-lambda-utils';
import { ArenaRunInfo, HighWinRunsInfo } from '../model';

export const filterRuns = (input: readonly HighWinRunsInfo[]): readonly ArenaRunInfo[] => {
	const allRuns = input.flatMap((info) => info.runs);
	// Keep 100 runs per class, ordered from latest to oldest
	const runsByClass: { [playerClass: string]: readonly ArenaRunInfo[] } = groupByFunction(
		(run: ArenaRunInfo) => run.playerClass,
	)(allRuns);
	const result: readonly ArenaRunInfo[] = Object.values(runsByClass)
		.map((runs) => [...runs].sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime()))
		.flatMap((runs) => runs.slice(0, 100))
		.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
	return result;
};
