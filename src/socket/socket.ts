/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Socket
 */

import * as HTTP from "http";
import * as SocketIO from "socket.io";
import { BarkSession } from "../session/session";
import { MiddleResponseExecuter, SessionDisconnectFunction, SessionFunctionResponse, SessionGreetingFunction, SessionInitiateFunction, SessionRejectedFunction, StatusHandler } from "./declare";

export class BarkSocket {

    public static create(): BarkSocket {

        return new BarkSocket();
    }

    private _io: SocketIO.Server | null;

    private _sessionInitiateFunction: SessionInitiateFunction | null;
    private _sessionRejectedFunction: SessionRejectedFunction | null;
    private _sessionDisconnectFunction: SessionDisconnectFunction | null;
    private _sessionGreetingFunction: SessionGreetingFunction | null;

    private _defaultStatusHandler: StatusHandler | null;
    private readonly _statusHandlers: Map<string, StatusHandler>;

    private constructor() {

        this._io = null;

        this._sessionInitiateFunction = null;
        this._sessionRejectedFunction = null;
        this._sessionDisconnectFunction = null;
        this._sessionGreetingFunction = null;

        this._defaultStatusHandler = null;
        this._statusHandlers = new Map();
    }

    public get statusHandlers(): Map<string, StatusHandler> {
        return this._statusHandlers;
    }

    public declareSessionInitiateFunction(func: SessionInitiateFunction): this {
        this._sessionInitiateFunction = func;
        return this;
    }
    public declareSessionRejectedFunction(func: SessionRejectedFunction): this {
        this._sessionRejectedFunction = func;
        return this;
    }
    public declareSessionDisconnectFunction(func: SessionDisconnectFunction): this {
        this._sessionDisconnectFunction = func;
        return this;
    }
    public declareSessionGreetingFunction(func: SessionGreetingFunction): this {
        this._sessionGreetingFunction = func;
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

            const sessionInitiateFunction: SessionInitiateFunction = this._assertSessionInitiateFunction();
            const session: BarkSession<any> | null = await Promise.resolve(sessionInitiateFunction(socket.handshake.headers));

            if (!session) {
                socket.disconnect();
                if (this._sessionRejectedFunction) {
                    this._sessionRejectedFunction(socket.handshake.headers);
                }
                return;
            }

            if (this._sessionGreetingFunction) {
                const response: SessionFunctionResponse = await this._sessionGreetingFunction(session);
                this._executeAction(socket, response);
            }

            socket.on('disconnect', () => {
                if (this._sessionDisconnectFunction) {
                    this._sessionDisconnectFunction(session);
                }
            });

            socket.on('message', async (message: string) => {

                const statusHandler: StatusHandler = this._getSessionMessageFunction(session.currentStatus);
                const executer: MiddleResponseExecuter = this._getExecuter(socket);

                const response: SessionFunctionResponse = await Promise.resolve(statusHandler(session, message, executer));

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

    public getSocketKeys(): string[] {

        const clients: SocketIO.Namespace | null = this.getClients();
        if (clients) {
            return Object.keys(clients.sockets);
        }
        return [];
    }

    public getSocketCount(): number {

        return this.getSocketKeys().length;
    }

    public getSocket(key: string): SocketIO.Socket | null {

        const clients: SocketIO.Namespace | null = this.getClients();
        if (clients) {
            return clients.sockets[key];
        }
        return null;
    }

    private _getExecuter(socket: SocketIO.Socket): MiddleResponseExecuter {

        return (response: SessionFunctionResponse): void => {
            this._executeAction(socket, response);
        };
    }

    private _executeAction(socket: SocketIO.Socket, response: SessionFunctionResponse) {

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

    private _assertSessionInitiateFunction(): SessionInitiateFunction {

        if (this._sessionInitiateFunction) {
            return this._sessionInitiateFunction;
        }
        throw new Error('[BARK-SHELL] Session initiate function is required');
    }

    private _getSessionMessageFunction(status: string | undefined): StatusHandler {

        if (!status) {
            if (this._defaultStatusHandler) {
                return this._defaultStatusHandler;
            }
            throw new Error('[BARK-SHELL] Session message function is required');
        }

        if (this._statusHandlers.has(status)) {
            return this._statusHandlers.get(status) as StatusHandler;
        }
        if (this._defaultStatusHandler) {
            return this._defaultStatusHandler;
        }
        throw new Error('[BARK-SHELL] Session message function is required');
    }
}
