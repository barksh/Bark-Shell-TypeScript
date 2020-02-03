/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Declare
 */

import { BarkShellResponse } from "../declare";
import { BarkSession } from "../session/session";

export type SessionFunctionResponse =
    BarkShellResponse
    | BarkShellResponse[]
    | null;

export type MiddleResponseExecuter = (response: SessionFunctionResponse) => void;

export type SessionInitiateFunction = (headers: Record<string, string>, authorization?: string) => (
    BarkSession
    | Promise<BarkSession>
    | null
    | Promise<null>
);

export type SessionRejectedFunction = (headers: Record<string, string>) => (void | Promise<void>);
export type SessionDisconnectFunction = (session: BarkSession) => (void | Promise<void>);
export type SessionGreetingFunction = (session: BarkSession) => (
    SessionFunctionResponse
    | Promise<SessionFunctionResponse>
);
export type StatusHandler = (session: BarkSession, message: string, executer: MiddleResponseExecuter) => (
    SessionFunctionResponse
    | Promise<SessionFunctionResponse>
);
