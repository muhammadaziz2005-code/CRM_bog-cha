/**
 * Uzbek cyrillic or latin date & currency formatting utilities
 */

// Format price in Uzbek Soums
export function formatSom(amount: number): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " so'm";
}

// Format ISO 8601 Uzbekistan datetime string with 'kun.oy.yil'
export function formatTashkentDate(isoString: string): string {
  if (!isoString) return "";
  try {
    const parted = isoString.split("T")[0];
    const parts = parted.split("-");
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
  } catch (e) {
    // fallback
  }
  return isoString;
}

// Format ISO 8601 Uzbekistan datetime string with time 'kun.oy.yil soat:daqiqa'
export function formatTashkentDateTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const [datePart, timePart] = isoString.split("T");
    const dates = datePart.split("-");
    let formattedDate = datePart;
    if (dates.length === 3) {
      formattedDate = `${dates[2]}.${dates[1]}.${dates[0]}`;
    }
    if (timePart) {
      const times = timePart.split(":");
      if (times.length >= 2) {
        return `${formattedDate} ${times[0]}:${times[1]}`;
      }
    }
    return formattedDate;
  } catch (e) {
    // fallback
  }
  return isoString;
}

// Generate the current timezone ISO string for Asia/Tashkent (UTC+5)
export function getTashkentISO(): string {
  const now = new Date();
  
  // Format to Tashkent date using Intl formatting so it matches local time regardless of environment
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

  const yyyy = partMap.year;
  const mm = partMap.month;
  const dd = partMap.day;
  const hh = partMap.hour;
  const min = partMap.minute;
  const ss = partMap.second;

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}+05:00`;
}

// Extract only date portion (YYYY-MM-DD) for form input value matches
export function getLocalDateInputVal(isoString: string): string {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

// Convert date input value (YYYY-MM-DD) to Tashkent ISO with safe default time
export function inputValToTashkentISO(dateVal: string): string {
  if (!dateVal) return getTashkentISO();
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${dateVal}T${hh}:${min}:${ss}+05:00`;
}
