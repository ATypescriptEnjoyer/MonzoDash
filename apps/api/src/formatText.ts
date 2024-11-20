export const formatText = (text: string): string =>
    text.split(/[_-]/).map((text) => text.slice(0, 1).toUpperCase() + text.slice(1)).join(" ");