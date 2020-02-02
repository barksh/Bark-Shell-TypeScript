/**
 * @author WMXPY
 * @namespace Bark_Shell_Session
 * @description Session
 */

export class BarkSession<A extends any = string, S extends string = string> {

    public static create<A extends any = string, S extends string = string>(
        authorization: A,
        initialStatus?: S,
    ): BarkSession<A, S> {

        const statusStack: S[] = initialStatus ? [initialStatus] : [];
        const context: Map<string, any> = new Map();
        return new BarkSession<A, S>(authorization, statusStack, context);
    }

    public static restore<A extends any = string, S extends string = string>(
        authorization: A,
        statusStack: S[],
        context: Record<string, any>,
    ): BarkSession<A, S> {

        const contextMap: Map<string, any> = new Map();
        const keys: string[] = Object.keys(context);
        for (const key of keys) {
            contextMap.set(key, context[key]);
        }
        return new BarkSession<A, S>(authorization, statusStack, contextMap);
    }

    private readonly _authorization: A;

    private readonly _statusStack: S[];
    private readonly _context: Map<string, any>;

    private constructor(authorization: A, statusStack: S[], context: Map<string, any>) {

        this._authorization = authorization;
        this._statusStack = statusStack;
        this._context = context;
    }

    public get authorization(): A {
        return this._authorization;
    }
    public get length(): number {
        return this._statusStack.length;
    }
    public get isEmptyStatus(): boolean {
        return this._statusStack.length === 0;
    }
    public get currentStatus(): S | undefined {
        return this._statusStack[0];
    }
    public get statusStack(): S[] {
        return this._statusStack;
    }

    public pushStatus(status: S): this {

        this._statusStack.unshift(status);
        return this;
    }

    public popStatus(): S | undefined {

        const currentStatus: S | undefined = this.statusStack.shift();
        return currentStatus;
    }

    public getContexts(): Record<string, any> {

        const result: Record<string, any> = {};
        const keys: Iterable<string> = this._context.keys();

        for (const key of keys) {
            result[key] = this._context.get(key) as any;
        }

        return result;
    }

    public getContext(key: string): any {

        return this._context.get(key);
    }

    public setContext(key: string, value: string): this {

        this._context.set(key, value);
        return this;
    }

    public replaceContext(newContext: Record<string, any>): this {

        this._context.clear();
        const keys: string[] = Object.keys(newContext);
        for (const key of keys) {
            this._context.set(key, newContext[key]);
        }
        return this;
    }

    public clearContext(): this {

        this._context.clear();
        return this;
    }
}
