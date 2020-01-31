/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Declare
 */

import { BarkShellResponse } from "../declare";
import { BarkUser } from "../status/user";

export type UserInitiateFunction = (headers: Record<string, string>) => (BarkUser | Promise<BarkUser>);
export type UserDisconnectFunction = (user: BarkUser) => (void | Promise<void>);
export type UserGreetingFunction = (user: BarkUser) => (
    BarkShellResponse
    | BarkShellResponse[]
    | null
    | Promise<null>
    | Promise<BarkShellResponse>
    | Promise<BarkShellResponse[]>
);
export type UserMessageFunction = (user: BarkUser, message: string) => (
    BarkShellResponse
    | BarkShellResponse[]
    | null
    | Promise<null>
    | Promise<BarkShellResponse>
    | Promise<BarkShellResponse[]>
);
