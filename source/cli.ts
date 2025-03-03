#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import {Separator} from 'subkit';
import {Format} from './types.js';
import * as ui from './ui.js';
import {loadFile, processFile} from './utils.js';
import * as validator from './validators.js';

const cli = meow(
	`
Usage
	$ subkit <file>... --format <format> [options]

Options
	-f, --format     Output format (srt, vtt, or fcpxml)
	-s, --separator  Separator for srt,vtt format (. or ,)
	--fps            Frame rate for fcpxml format
	--help           Output usage information

Examples
	$ subkit file.srt --format vtt
	$ sbukit file.srt file2.srt --format fcpxml --fps 24
	$ subkit file.srt file.fcpxml --format srt --separator .
`,
	{
		importMeta: import.meta,
		flags: {
			format: {
				type: 'string',
				shortFlag: 'f',
			},
			separator: {
				type: 'string',
				shortFlag: 's',
			},
			fps: {
				type: 'number',
			},
		},
	},
);

const filePaths = cli.input;
const {format, separator, fps} = cli.flags;

validator.filePathsValidator(filePaths);
validator.formatValidator(format);
validator.separatorValidator(format, separator);
validator.fpsValidator(format, fps);

const files = await Promise.all(
	filePaths.map(async (filePath) => loadFile(filePath)),
);

const results = await Promise.all(
	files.map(async (file) =>
		processFile(file, format as Format, separator as Separator, fps),
	),
);

const converted = results.filter((result) => result.ok);
const allConverted = converted.length === filePaths.length;

for (const item of converted) {
	console.log(
		(allConverted ? '' : '\n') + ui.info,
		`Built ${ui.green(item.file.filePath)} to ${ui.green(item.outPath)}`,
	);
}

console.log(
	'\n' + (allConverted ? ui.done : ui.info),
	`Converted ${converted.length}/${filePaths.length} files`,
);

if (converted.length === 0) {
	process.exit(1);
}
