import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * PIN Security Utilities
 * Provides secure PIN hashing, verification, and validation
 */

const SALT_ROUNDS = 12;
const PIN_LENGTH = 4; // Keep 4 digits for backward compatibility
const MIN_PIN_COMPLEXITY = 2; // Minimum number of unique digits for 4-digit PIN

// Rate limiting configuration
const MAX_ATTEMPTS_PER_HOUR = 5;
const MAX_ATTEMPTS_PER_DAY = 10;
const LOCKOUT_DURATION_HOURS = 1;

// Rotating PIN configuration
const ROTATION_INTERVAL_MINUTES = 30; // Rotate PIN every 30 minutes
const ROTATION_WINDOW_MS = ROTATION_INTERVAL_MINUTES * 60 * 1000;

export interface RotatingPinResult {
  currentPin: string;
  nextRotationAt: Date;
  rotationInterval: number;
  isActive: boolean;
}

export interface PinSecurityResult {
  success: boolean;
  message: string;
  hashedPin?: string;
  salt?: string;
  expiresAt?: Date;
}

export interface PinValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates PIN format and complexity
 */
export function validatePinFormat(pin: string): PinValidationResult {
  const cleanPin = String(pin || '').trim();
  
  // Check length
  if (cleanPin.length !== PIN_LENGTH) {
    return {
      isValid: false,
      message: `PIN must be exactly ${PIN_LENGTH} digits`
    };
  }
  
  // Check if numeric
  if (!/^\d+$/.test(cleanPin)) {
    return {
      isValid: false,
      message: "PIN must contain only numbers"
    };
  }
  
  // Check complexity (minimum unique digits)
  const uniqueDigits = new Set(cleanPin.split('')).size;
  if (uniqueDigits < MIN_PIN_COMPLEXITY) {
    return {
      isValid: false,
      message: `PIN must contain at least ${MIN_PIN_COMPLEXITY} different digits`
    };
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /(\d)\1{2,}/, // Repeated digits (111, 222, 1111, etc.)
    /1234|4321/, // Sequential patterns for 4 digits
    /0123|3210/, // Sequential with zero
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(cleanPin)) {
      return {
        isValid: false,
        message: "PIN cannot contain repeated or sequential patterns"
      };
    }
  }
  
  return {
    isValid: true,
    message: "PIN is valid"
  };
}

/**
 * Generates a secure PIN hash with salt
 */
export async function hashPin(pin: string): Promise<PinSecurityResult> {
  try {
    // Validate PIN format first
    const validation = validatePinFormat(pin);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message
      };
    }
    
    const cleanPin = String(pin).trim();
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Create salted PIN for hashing
    const saltedPin = cleanPin + salt;
    const hashedPin = await bcrypt.hash(saltedPin, SALT_ROUNDS);
    
    // Set expiration to 90 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    
    return {
      success: true,
      message: "PIN hashed successfully",
      hashedPin,
      salt,
      expiresAt
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to hash PIN"
    };
  }
}

/**
 * Verifies a PIN against its hash
 */
export async function verifyPin(
  pin: string, 
  hashedPin: string, 
  salt: string, 
  expiresAt?: Date
): Promise<PinValidationResult> {
  try {
    // Check if PIN has expired
    if (expiresAt && new Date() > expiresAt) {
      return {
        isValid: false,
        message: "PIN has expired. Please request a new PIN from the vendor."
      };
    }
    
    const cleanPin = String(pin || '').trim();
    
    // Validate PIN format
    const validation = validatePinFormat(cleanPin);
    if (!validation.isValid) {
      return validation;
    }
    
    // Create salted PIN for verification
    const saltedPin = cleanPin + salt;
    const isMatch = await bcrypt.compare(saltedPin, hashedPin);
    
    return {
      isValid: isMatch,
      message: isMatch ? "PIN verified successfully" : "Invalid PIN"
    };
  } catch (error) {
    return {
      isValid: false,
      message: "PIN verification failed"
    };
  }
}

/**
 * Generates a secure random PIN
 */
export function generateSecurePin(): string {
  let pin: string;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    // Generate 4 random digits
    pin = Array.from({ length: PIN_LENGTH }, () => 
      Math.floor(Math.random() * 10)
    ).join('');
    
    attempts++;
    if (attempts > maxAttempts) {
      // Fallback to a manually crafted secure PIN if random generation fails
      pin = '1' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      break;
    }
  } while (!validatePinFormat(pin).isValid);
  
  return pin;
}

/**
 * Generates a rotating PIN based on deal ID and current time window
 */
export function generateRotatingPin(dealId: number): RotatingPinResult {
  const now = new Date();
  const currentWindow = Math.floor(now.getTime() / ROTATION_WINDOW_MS);
  
  // Create a deterministic seed based on dealId and time window
  const seed = `${dealId}-${currentWindow}`;
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
  // Convert first 8 characters of hash to a number and generate PIN
  const hashNum = parseInt(hash.substring(0, 8), 16);
  let pin = String(hashNum % 10000).padStart(4, '0');
  
  // Ensure PIN meets complexity requirements
  let attempts = 0;
  while (!validatePinFormat(pin).isValid && attempts < 10) {
    const offset = attempts + 1;
    const offsetHash = crypto.createHash('sha256').update(seed + offset).digest('hex');
    const offsetNum = parseInt(offsetHash.substring(0, 8), 16);
    pin = String(offsetNum % 10000).padStart(4, '0');
    attempts++;
  }
  
  // Calculate next rotation time
  const nextRotationAt = new Date((currentWindow + 1) * ROTATION_WINDOW_MS);
  
  return {
    currentPin: pin,
    nextRotationAt,
    rotationInterval: ROTATION_INTERVAL_MINUTES,
    isActive: true
  };
}

/**
 * Verifies if a PIN is valid for the current or previous rotation window
 */
export function verifyRotatingPin(dealId: number, inputPin: string): boolean {
  const currentResult = generateRotatingPin(dealId);
  
  // Check current window
  if (currentResult.currentPin === inputPin) {
    return true;
  }
  
  // Check previous window (grace period for users who got PIN just before rotation)
  const previousWindow = Math.floor(Date.now() / ROTATION_WINDOW_MS) - 1;
  const previousSeed = `${dealId}-${previousWindow}`;
  const previousHash = crypto.createHash('sha256').update(previousSeed).digest('hex');
  const previousHashNum = parseInt(previousHash.substring(0, 8), 16);
  let previousPin = String(previousHashNum % 10000).padStart(4, '0');
  
  // Ensure previous PIN meets complexity requirements
  let attempts = 0;
  while (!validatePinFormat(previousPin).isValid && attempts < 10) {
    const offset = attempts + 1;
    const offsetHash = crypto.createHash('sha256').update(previousSeed + offset).digest('hex');
    const offsetNum = parseInt(offsetHash.substring(0, 8), 16);
    previousPin = String(offsetNum % 10000).padStart(4, '0');
    attempts++;
  }
  
  return previousPin === inputPin;
}

/**
 * Checks if user has exceeded PIN attempt limits
 */
export function checkRateLimit(attempts: Array<{ attemptedAt: Date, success: boolean }>): {
  allowed: boolean;
  message: string;
  nextAttemptAt?: Date;
} {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  // Count attempts in the last hour and day
  const attemptsLastHour = attempts.filter(a => a.attemptedAt > oneHourAgo);
  const attemptsLastDay = attempts.filter(a => a.attemptedAt > oneDayAgo);
  const failedAttemptsLastHour = attemptsLastHour.filter(a => !a.success);
  
  // Check hourly limit
  if (failedAttemptsLastHour.length >= MAX_ATTEMPTS_PER_HOUR) {
    const oldestFailedAttempt = failedAttemptsLastHour[0];
    const nextAttemptAt = new Date(oldestFailedAttempt.attemptedAt.getTime() + LOCKOUT_DURATION_HOURS * 60 * 60 * 1000);
    
    return {
      allowed: false,
      message: `Too many failed PIN attempts. Please try again after ${nextAttemptAt.toLocaleTimeString()}.`,
      nextAttemptAt
    };
  }
  
  // Check daily limit
  if (attemptsLastDay.length >= MAX_ATTEMPTS_PER_DAY) {
    const nextAttemptAt = new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000);
    
    return {
      allowed: false,
      message: `Daily PIN attempt limit exceeded. Please try again tomorrow.`,
      nextAttemptAt
    };
  }
  
  return {
    allowed: true,
    message: "PIN attempt allowed"
  };
}