export interface HighWinRunsInfo {
	lastUpdated: Date;
	timePeriod: TimePeriod;
	runs: readonly ArenaRunInfo[];
}

export interface ArenaRunInfo {
	id: number;
	creationDate: Date;
	playerClass: string;
	decklist: string;
	wins: number;
	losses: number;
	deckScore: number;
	// picks: readonly Pick[];
	// matches: readonly GameStat[];
}

// export interface GameStat {
// 	readonly additionalResult: string;
// 	readonly creationTimestamp: number;
// 	readonly result: 'won' | 'lost' | 'tied';
// 	readonly coinPlay: 'coin' | 'play';
// 	readonly playerClass: string;
// 	readonly playerRank: string | undefined;
// 	readonly opponentClass: string;
// }

export type TimePeriod = 'past-20' | 'past-7' | 'past-3' | 'current-season' | 'last-patch';
