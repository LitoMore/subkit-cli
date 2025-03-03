import fs from 'node:fs/promises';
import path from 'node:path';
import {
	Separator,
	SubLike,
	dataToFcpxml,
	dataToSrt,
	dataToVtt,
	detectFormat,
	fcpxmlToData,
	srtToData,
	vttToData,
} from 'subkit';
import {Format, ProcessResult, SubFile} from './types.js';
import * as ui from './ui.js';

export const supportedExtensions = ['srt', 'vtt', 'fcpxml'];
export const supportedSeparators = [',', '.'];

export const toData = (text: string, format: Format): SubLike => {
	switch (format) {
		case 'srt': {
			return srtToData(text);
		}

		case 'vtt': {
			return vttToData(text);
		}

		case 'fcpxml': {
			return fcpxmlToData(text);
		}
	}
};

export const toText = (
	data: SubLike,
	format: Format,
	options: {
		separator?: Separator;
		fps?: number;
	} = {},
): string => {
	const {separator, fps = 30} = options;
	console.log(fps);

	switch (format) {
		case 'srt': {
			return dataToSrt(data, separator ?? ',');
		}

		case 'vtt': {
			return dataToVtt(data, separator ?? '.');
		}

		case 'fcpxml': {
			return dataToFcpxml(data, fps);
		}
	}
};

export const loadFile = async (filePath: string): Promise<SubFile> => {
	const extension = path.extname(filePath).slice(1) || detectFormat(filePath);
	if (!extension) {
		console.error(ui.warn, `Unknown file format: ${ui.red(filePath)}`);
		return {filePath};
	}

	if (!supportedExtensions.includes(extension)) {
		console.error(ui.warn, `Unsupported format: ${ui.red(extension)}`);
		return {filePath, extension};
	}

	try {
		const content = await fs.readFile(filePath, 'utf8');
		return {
			filePath,
			extension,
			data: toData(content, extension as Format),
		};
	} catch (error) {
		if (error instanceof Error) console.error(ui.error, error.message);
		return {filePath, extension};
	}
};

export const processFile = async (
	file: SubFile,
	format: Format,
	separator?: Separator,
	fps?: number,
): Promise<ProcessResult> => {
	if (!file.data) {
		return {file};
	}

	const text = toText(file.data, format, {
		separator,
		fps,
	});
	const {dir, name} = path.parse(file.filePath);
	const outPath = `${dir}${name}.${format}`;
	try {
		await fs.writeFile(outPath, text + '\n', 'utf8');
		return {file, outPath, ok: true};
	} catch (error) {
		if (error instanceof Error) console.error(ui.error, error.message);
		return {file, outPath};
	}
};
