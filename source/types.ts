import {SubLike} from 'subkit';

export type Format = 'srt' | 'vtt' | 'fcpxml';

export type Stage = 'loading' | 'processing' | 'done' | 'error';

export type SubFile = {
	filePath: string;
	extension?: string;
	data?: SubLike;
};

export type ProcessResult = {
	file: SubFile;
	outPath?: string;
	ok?: boolean;
};
