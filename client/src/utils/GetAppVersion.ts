const { REACT_APP_VERSION } = process.env;

export const GetAppVersion = (): string => `${REACT_APP_VERSION}`;
