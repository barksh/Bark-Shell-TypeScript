/**
 * @author WMXPY
 * @namespace Bark_Shell_Status
 * @description User
 */

export class BarkUser<T extends any = string> {

    public static create<T extends any = string>(username: string, initialStatus?: T): BarkUser<T> {

        return new BarkUser<T>(username, initialStatus);
    }

    private readonly _username: string;

    private readonly _statusStack: T[];

    private constructor(username: string, initialStatus?: T) {

        this._username = username;
        this._statusStack = initialStatus ? [initialStatus] : [];
    }

    public get username(): string {
        return this._username;
    }
    public get length(): number {
        return this._statusStack.length;
    }
    public get isEmptyStatus(): boolean {
        return this._statusStack.length === 0;
    }
    public get currentStatus(): T | undefined {
        return this._statusStack[0];
    }
    public get statusStack(): T[] {
        return this._statusStack;
    }

    public pushStatus(status: T): this {

        this._statusStack.unshift(status);
        return this;
    }

    public popStatus(): T | undefined {

        const currentStatus: T | undefined = this.statusStack.shift();
        return currentStatus;
    }
}
