#!/usr/bin/env node
import process from 'node:process';
import * as ui from './ui.js';
import {supportedExtensions, supportedSeparators} from './utils.js';

export const formatValidator = (format: string) => {
	if (!supportedExtensions.includes(format)) {
		console.error(ui.error, `Unsupported format: ${ui.red(format)}`);
		process.exit(1);
	}
};

export const separatorValidator = (format: string, separator?: string) => {
	if (
		(format === 'srt' || format === 'vtt') &&
		separator &&
		!supportedSeparators.includes(separator)
	) {
		console.error(ui.error, 'Separator must be either "." or ","');
		process.exit(1);
	}
};

export const fpsValidator = (format: string, fps?: number) => {
	if (format === 'fcpxml') {
		if (Number.isNaN(Number(fps))) {
			console.error(ui.error, 'fps must be a number');
		} else {
			const rate = Number(fps);
			if (rate <= 0) {
				console.error(ui.error, 'fps must be greater than 0');
			}
		}

		process.exit(1);
	}
};
