/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Declare
 */

import { BarkShellResponse } from "../declare";
import { BarkUser } from "../status/user";

export type UserFunctionResponse =
    BarkShellResponse
    | BarkShellResponse[]
    | null;

export type MiddleResponseExecuter = (response: UserFunctionResponse) => void;

export type UserInitiateFunction = (headers: Record<string, string>) => (BarkUser | Promise<BarkUser>);
export type UserDisconnectFunction = (user: BarkUser) => (void | Promise<void>);
export type UserGreetingFunction = (user: BarkUser) => (
    UserFunctionResponse
    | Promise<UserFunctionResponse>
);
export type UserMessageFunction = (user: BarkUser, message: string, executer: MiddleResponseExecuter) => (
    UserFunctionResponse
    | Promise<UserFunctionResponse>
);
