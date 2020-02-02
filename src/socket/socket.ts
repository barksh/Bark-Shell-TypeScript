/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Socket
 */

import * as HTTP from "http";
import * as SocketIO from "socket.io";
import { BarkSession } from "../session/session";
import { MiddleResponseExecuter, StatusHandler, UserDisconnectFunction, UserFunctionResponse, UserGreetingFunction, UserInitiateFunction } from "./declare";

export class BarkSocket {

    public static create(): BarkSocket {

        return new BarkSocket();
    }

    private _io: SocketIO.Server | null;

    private _userInitiateFunction: UserInitiateFunction | null;
    private _userDisconnectFunction: UserDisconnectFunction | null;
    private _userGreetingFunction: UserGreetingFunction | null;

    private _defaultStatusHandler: StatusHandler | null;
    private readonly _statusHandlers: Map<string, StatusHandler>;

    private constructor() {

        this._io = null;

        this._userInitiateFunction = null;
        this._userDisconnectFunction = null;
        this._userGreetingFunction = null;

        this._defaultStatusHandler = null;
        this._statusHandlers = new Map();
    }

    public get statusHandlers(): Map<string, StatusHandler> {
        return this._statusHandlers;
    }

    public declareUserInitiateFunction(func: UserInitiateFunction): this {
        this._userInitiateFunction = func;
        return this;
    }
    public declareUserDisconnectFunction(func: UserDisconnectFunction): this {
        this._userDisconnectFunction = func;
        return this;
    }
    public declareUserGreetingFunction(func: UserGreetingFunction): this {
        this._userGreetingFunction = func;
        return this;
    }
    public declareDefaultStatusHandler(func: StatusHandler): this {
        this._defaultStatusHandler = func;
        return this;
    }

    public declareStatusHandler(status: string, func: StatusHandler): this {

        this._statusHandlers.set(status, func);
        return this;
    }

    public extend(server: HTTP.Server, path: string, origins?: string) {

        this._io = SocketIO(server, {

            path,
            serveClient: false,
            origins,

            cookie: false,
        });

        this._io.on('connection', async (socket: SocketIO.Socket) => {

            console.log(Object.keys(this._io?.clients().sockets as any).length);

            const userInitiateFunction: UserInitiateFunction = this._assertUserInitiateFunction();
            const user: BarkSession<any> | null = await Promise.resolve(userInitiateFunction(socket.handshake.headers));

            if (!user) {
                socket.disconnect();
                console.log(Object.keys(this._io?.clients().sockets as any).length);
                return;
            }

            if (this._userGreetingFunction) {
                const response: UserFunctionResponse = await this._userGreetingFunction(user);
                this._executeAction(socket, response);
            }

            socket.on('disconnect', () => {
                if (this._userDisconnectFunction) {
                    this._userDisconnectFunction(user);
                }
            });

            socket.on('message', async (message: string) => {

                const statusHandler: StatusHandler = this._getUserMessageFunction(user.currentStatus);
                const executer: MiddleResponseExecuter = this._getExecuter(socket);

                const response: UserFunctionResponse = await Promise.resolve(statusHandler(user, message, executer));

                this._executeAction(socket, response);
            });
        });
    }

    public getClients(): SocketIO.Namespace | null {

        if (this._io) {
            return this._io.clients();
        }
        return null;
    }

    private _getExecuter(socket: SocketIO.Socket): MiddleResponseExecuter {

        return (response: UserFunctionResponse): void => {
            this._executeAction(socket, response);
        };
    }

    private _executeAction(socket: SocketIO.Socket, response: UserFunctionResponse) {

        if (!response) {
            return;
        }
        if (Array.isArray(response)) {
            for (const each of response) {
                socket.emit('message', each);
            }
        } else {
            socket.emit('message', response);
        }
    }

    private _assertUserInitiateFunction(): UserInitiateFunction {

        if (this._userInitiateFunction) {
            return this._userInitiateFunction;
        }
        throw new Error('[BARK-SHELL] User initiate function is required');
    }

    private _getUserMessageFunction(status: string | undefined): StatusHandler {

        if (!status) {
            if (this._defaultStatusHandler) {
                return this._defaultStatusHandler;
            }
            throw new Error('[BARK-SHELL] User message function is required');
        }

        if (this._statusHandlers.has(status)) {
            return this._statusHandlers.get(status) as StatusHandler;
        }
        if (this._defaultStatusHandler) {
            return this._defaultStatusHandler;
        }
        throw new Error('[BARK-SHELL] User message function is required');
    }
}
