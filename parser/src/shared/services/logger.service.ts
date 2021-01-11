export class Logger {
    static info(...args: any[]) {
        console.log(new Date().toLocaleString() + ' |', ...args);
    }
    static error(...args: any[]) {
        console.error(new Date().toLocaleString() + ' |', ...args);
    }
}