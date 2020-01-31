/**
 * @author WMXPY
 * @namespace Bark_Shell
 * @description User
 */

export class BarkUser<T extends any = string> {

    public static create<T extends any = string>(username: string, status: T): BarkUser<T> {

        return new BarkUser<T>(username, status);
    }

    private readonly _username: string;

    private _status: T;

    private constructor(username: string, status: T) {

        this._username = username;
        this._status = status;
    }

    public get username(): string {
        return this._username;
    }
    public get status(): T {
        return this._status;
    }

    public setStatus(status: T): this {

        this._status = status;
        return this;
    }
}
