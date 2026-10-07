export function debounce(fn, delay) {
  let timeout;
  return function (...args) {

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay)
  }
}

export function getDayLabel(dateString) {
  if (!dateString) return '';

  const msgDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Strip time components for pure date comparison
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(msgDate, today)) {
    return 'Today';
  }

  if (isSameDay(msgDate, yesterday)) {
    return 'Yesterday';
  }

  // Fallback format for older dates: "October 24, 2026"
  return msgDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export function isDifferentDay(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return true;
  // console.log(dateStr1, dateStr2);
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  return (
    d1.getFullYear() !== d2.getFullYear() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getDate() !== d2.getDate()
  );
}


export const getLocalTime = (dateString) => {
  if (!dateString) return '';

  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // e.g., "3:45 PM"
  });
};

export const getLocalTime24 = (dateString) => {
  if (!dateString) return '';

  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // e.g., "15:45"
  });
};


// Helper function for generating unique IDs safely
export const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  
  // Fallback using crypto.getRandomValues if available
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }

  // Final fallback (Math.random)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};