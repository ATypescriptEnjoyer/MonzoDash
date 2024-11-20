const { VITE_APP_VERSION } = import.meta.env;

export const GetAppVersion = (): string => `${VITE_APP_VERSION}`;
