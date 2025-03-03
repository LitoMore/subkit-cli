# subkit-cli

The subtitles toolkit for converting between SRT, WebVTT, and FCPXML

## Install

```shell
npm i subkit-cli
```

## Usage

```
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
```

## Related

- [subkit](https://github.com/LitoMore/subkit) - API for this module

## License

MIT
