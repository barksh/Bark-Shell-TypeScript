/**
 * @author WMXPY
 * @namespace Bark_Shell_Shell
 * @description Declare
 */

import { BarkUser } from "../status/user";

export type TopicExecutable = (user: BarkUser, message: string) => string;
