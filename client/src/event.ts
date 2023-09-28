const subscribe = (eventName: string, listener: () => void) => {
  document.addEventListener(eventName, listener);
};

const unsubscribe = (eventName: string, listener: () => void) => {
  document.removeEventListener(eventName, listener);
};

const publish = (eventName: string, data: any) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};

enum EVENT_TYPES {
  SALARY_DETAILS_OPEN = 'SALARY_DETAILS_OPEN',
  DEDICATED_SPENDING_OPEN = 'DEDICATED_SPENDING_OPEN',
}

export { publish, subscribe, unsubscribe, EVENT_TYPES };
