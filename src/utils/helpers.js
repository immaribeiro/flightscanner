export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async waitIfNeeded() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    this.requests.push(now);
  }
}

export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };

  constructor(level = 'INFO') {
    this.level = Logger.levels[level] || Logger.levels.INFO;
  }

  error(message, ...args) {
    if (this.level >= Logger.levels.ERROR) {
      console.error(`❌ [ERROR] ${message}`, ...args);
    }
  }

  warn(message, ...args) {
    if (this.level >= Logger.levels.WARN) {
      console.warn(`⚠️  [WARN] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.level >= Logger.levels.INFO) {
      console.log(`ℹ️  [INFO] ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    if (this.level >= Logger.levels.DEBUG) {
      console.log(`🔍 [DEBUG] ${message}`, ...args);
    }
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

export function normalizeAirportCode(input) {
  const airportCodes = {
    'new york': 'JFK',
    'nyc': 'JFK',
    'london': 'LHR',
    'los angeles': 'LAX',
    'la': 'LAX',
    'san francisco': 'SFO',
    'chicago': 'ORD',
    'paris': 'CDG',
    'tokyo': 'NRT',
    'dubai': 'DXB'
  };

  const normalized = input.toLowerCase().trim();
  return airportCodes[normalized] || input.toUpperCase();
}
