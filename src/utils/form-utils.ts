import axios from "axios";

export function toIsoDateTime(value: string): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

export function parseOptionalCoordinate(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function validateDates(
  startDate: string | null,
  endDate: string | null,
  endRaw: string,
  errorMessages: { invalidDate: string; endDateBeforeStart: string },
): string | null {
  if (!startDate || (endRaw && !endDate)) {
    return errorMessages.invalidDate;
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return errorMessages.endDateBeforeStart;
  }

  return null;
}

export function validateCoordinates(
  latRaw: string,
  lonRaw: string,
  errorMessages: { pairRequired: string; invalid: string },
): string | null {
  const lat = parseOptionalCoordinate(latRaw);
  const lon = parseOptionalCoordinate(lonRaw);

  if ((lat === null) !== (lon === null)) {
    return errorMessages.pairRequired;
  }

  if (
    (latRaw && !Number.isFinite(lat)) ||
    (lonRaw && !Number.isFinite(lon)) ||
    (lat !== null && (lat < -90 || lat > 90)) ||
    (lon !== null && (lon < -180 || lon > 180))
  ) {
    return errorMessages.invalid;
  }

  return null;
}

export function validateRecaptcha(
  hasSiteKey: boolean,
  token: string,
  errorMessage: string,
): string | null {
  if (hasSiteKey && !token) {
    return errorMessage;
  }
  return null;
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error?.message) return data.error.message;
    if (typeof data === "string") return data;
    if (data) return JSON.stringify(data);
    return error.message;
  }
  return String(error);
}
