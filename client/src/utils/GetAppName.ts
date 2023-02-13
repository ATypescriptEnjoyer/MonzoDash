const { VITE_APP_NAME } = import.meta.env;

export const GetAppName = (): string => `${VITE_APP_NAME?.slice(0, 1).toUpperCase()}${VITE_APP_NAME?.substring(1)}`;
