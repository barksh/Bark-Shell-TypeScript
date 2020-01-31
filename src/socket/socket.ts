/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Socket
 */

import * as HTTP from "http";
import * as SocketIO from "socket.io";
import { BarkShellResponse } from "../declare";
import { BarkUser } from "../status/user";
import { UserDisconnectFunction, UserInitiateFunction, UserMessageFunction } from "./declare";

export class BarkSocket {

    public static extend(server: HTTP.Server): BarkSocket {

        const io: SocketIO.Server = SocketIO(server);
        return new BarkSocket(io);
    }

    private readonly _io: SocketIO.Server;

    private _userInitiateFunction: UserInitiateFunction | null;
    private _userDisconnectFunction: UserDisconnectFunction | null;
    private _userMessageFunction: UserMessageFunction | null;

    private constructor(io: SocketIO.Server) {

        this._io = io;
        this._userInitiateFunction = null;
        this._userDisconnectFunction = null;
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

    private _initServer() {

        this._io.on('connection', async (socket: SocketIO.Socket) => {

            const userInitiateFunction: UserInitiateFunction = this._assertUserInitiateFunction();
            const user: BarkUser<any> = await Promise.resolve(userInitiateFunction(socket.handshake.headers));

            socket.on('disconnect', () => {
                if (this._userDisconnectFunction) {
                    this._userDisconnectFunction(user);
                }
            });

            socket.on('message', async (message: string) => {
                const userMessageFunction: UserMessageFunction = this._assertUserMessageFunction();
                const response: BarkShellResponse | null = await Promise.resolve(userMessageFunction(user, message));
                if (response) {
                    socket.emit('message-response', response);
                }
            });
        });
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
