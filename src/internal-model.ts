export interface InternalArenaRunRow {
	id: number;
	creationDate: Date;
	runId: string;
	playerClass: string;
	decklist: string;
	wins: number;
	losses: number;
	buildNumber: number;
	allowGameShare: boolean;
}
