const { REACT_APP_NAME } = process.env;

export const GetAppName = (): string => `${REACT_APP_NAME?.slice(0, 1).toUpperCase()}${REACT_APP_NAME?.substring(1)}`;
