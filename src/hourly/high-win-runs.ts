import { getConnectionReadOnly } from '@firestone-hs/aws-lambda-utils';
import { ServerlessMysql } from 'serverless-mysql';
import { InternalArenaRunRow } from '../internal-model';
import { ArenaRunInfo } from '../model';

export const buildHighWinRuns = async (rows: readonly InternalArenaRunRow[]): Promise<readonly ArenaRunInfo[]> => {
	const validRows = rows;
	console.debug('building runs', validRows.length);
	const mysql = await getConnectionReadOnly();
	const result: readonly ArenaRunInfo[] = await Promise.all(validRows.map((row) => buildHighWinRun(row, mysql)));
	await mysql.end();
	return result;
};

const buildHighWinRun = async (row: InternalArenaRunRow, mysql: ServerlessMysql): Promise<ArenaRunInfo> => {
	const deckScore = await getDeckScore(row, mysql);
	const result: ArenaRunInfo = {
		id: row.id,
		creationDate: row.creationDate,
		playerClass: row.playerClass,
		decklist: row.decklist,
		wins: row.wins,
		losses: row.losses,
		deckScore: deckScore,
		// Picks and matches are not built on a timer, but built when a user requests the data
		// picks: picks,
		// matches: matches,
	};
	return result;
};

const getDeckScore = async (row: InternalArenaRunRow, mysql: ServerlessMysql): Promise<number | null> => {
	const query = `
        SELECT deckScore
        FROM arena_draft_stat
        WHERE runId = ?
    `;
	const result: { deckScore: number }[] = await mysql.query(query, [row.runId]);
	if (result && result.length > 0) {
		return result[0].deckScore;
	}
	return null;
};
