/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Declare
 */

import { BarkShellResponse } from "../declare";
import { BarkSession } from "../session/session";

export type UserFunctionResponse =
    BarkShellResponse
    | BarkShellResponse[]
    | null;

export type MiddleResponseExecuter = (response: UserFunctionResponse) => void;

export type UserInitiateFunction = (headers: Record<string, string>) => (BarkSession | Promise<BarkSession>);
export type UserDisconnectFunction = (user: BarkSession) => (void | Promise<void>);
export type UserGreetingFunction = (user: BarkSession) => (
    UserFunctionResponse
    | Promise<UserFunctionResponse>
);
export type StatusHandler = (user: BarkSession, message: string, executer: MiddleResponseExecuter) => (
    UserFunctionResponse
    | Promise<UserFunctionResponse>
);
