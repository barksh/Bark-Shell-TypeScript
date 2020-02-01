/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Declare
 */

import { BarkShellResponse } from "../declare";
import { BarkUser } from "../status/user";

export type TopicResponse =
    string
    | BarkShellResponse
    | Array<BarkShellResponse | string>;

export type TopicExecutable = (user: BarkUser, message: string) => (
    TopicResponse
    | Promise<TopicResponse>
);
