import chalkPipe from 'chalk-pipe';

export const red = chalkPipe('red');
export const green = chalkPipe('green');
export const error = chalkPipe('black.bgRed')(' ERROR ');
export const warn = chalkPipe('black.bgYellow')(' WARN ');
export const info = chalkPipe('black.bgCyan')(' INFO ');
export const done = chalkPipe('black.bgGreen')(' DONE ');
