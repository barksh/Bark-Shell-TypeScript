/**
 * @author WMXPY
 * @namespace Bark_Shell_Socket
 * @description Util
 */

export const parseAuthorization = (headers: Record<string, string>): string | undefined => {

    const token: string | undefined = headers.authorization ?? headers.Authorization;
    if (!token) {
        return undefined;
    }

    const splited: string[] = token.split(' ');
    if (splited.length !== 2) {
        return undefined;
    }

    return splited[1];
};
