export declare const extractNameAndIdentifier: (candidate: string) => {
    name: string;
    identifier: string;
};
export declare const extractCorrectIdentifierBySemver: (possibleMatches: string[], versionToMatch: string) => string;
