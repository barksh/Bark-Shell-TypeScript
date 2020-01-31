/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Socket
 */

import * as HTTP from "http";
import * as SocketIO from "socket.io";
import { BarkShellResponse } from "../declare";
import { BarkUser } from "../status/user";
import { UserDisconnectFunction, UserGreetingFunction, UserInitiateFunction, UserMessageFunction } from "./declare";

export class BarkSocket {

    public static extend(server: HTTP.Server): BarkSocket {

        const io: SocketIO.Server = SocketIO(server);
        return new BarkSocket(io);
    }

    private readonly _io: SocketIO.Server;

    private _userInitiateFunction: UserInitiateFunction | null;
    private _userDisconnectFunction: UserDisconnectFunction | null;
    private _userGreetingFunction: UserGreetingFunction | null;
    private _userMessageFunction: UserMessageFunction | null;

    private constructor(io: SocketIO.Server) {

        this._io = io;
        this._userInitiateFunction = null;
        this._userDisconnectFunction = null;
        this._userGreetingFunction = null;
        this._userMessageFunction = null;
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
    public declareUserMessageFunction(func: UserMessageFunction): this {
        this._userMessageFunction = func;
        return this;
    }

    public initial() {

        this._io.on('connection', async (socket: SocketIO.Socket) => {

            const userInitiateFunction: UserInitiateFunction = this._assertUserInitiateFunction();
            const user: BarkUser<any> = await Promise.resolve(userInitiateFunction(socket.handshake.headers));

            if (this._userGreetingFunction) {
                const response: BarkShellResponse | BarkShellResponse[] | null = await this._userGreetingFunction(user);
                this._executeAction(socket, response);
            }

            socket.on('disconnect', () => {
                if (this._userDisconnectFunction) {
                    this._userDisconnectFunction(user);
                }
            });

            socket.on('message', async (message: string) => {
                const userMessageFunction: UserMessageFunction = this._assertUserMessageFunction();
                const response: BarkShellResponse | BarkShellResponse[] | null = await Promise.resolve(userMessageFunction(user, message));
                this._executeAction(socket, response);
            });
        });
    }

    private _executeAction(socket: SocketIO.Socket, response: BarkShellResponse | BarkShellResponse[] | null) {

        if (!response) {
            return;
        }
        if (Array.isArray(response)) {
            for (const each of response) {
                socket.emit('message-response', each);
            }
        } else {
            socket.emit('message-response', response);
        }
    }

    private _assertUserInitiateFunction(): UserInitiateFunction {

        if (this._userInitiateFunction) {
            return this._userInitiateFunction;
        }
        throw new Error('[BARK-SHELL] User initiate function is required');
    }

    private _assertUserMessageFunction(): UserMessageFunction {

        if (this._userMessageFunction) {
            return this._userMessageFunction;
        }
        throw new Error('[BARK-SHELL] User message function is required');
    }
}
