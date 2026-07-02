const STORAGE_KEYS = {
  GARDEN: 'bouquet_garden',
  FAVORITES: 'bouquet_favorites',
  VIEWS: 'bouquet_views',
  APPRECIATIONS: 'bouquet_appreciations',
  SCHEDULED: 'bouquet_scheduled',
};

export function saveBouquetToGarden(bouquet) {
  if (typeof window === 'undefined') return;
  try {
    const garden = getGarden();
    const entry = {
      ...bouquet,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      views: 0,
      appreciations: 0,
    };
    garden.unshift(entry);
    if (garden.length > 50) garden.pop();
    localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(garden));
    return entry.id;
  } catch (e) {
    console.error('Failed to save bouquet:', e);
    return null;
  }
}

export function getGarden() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GARDEN);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteBouquetFromGarden(id) {
  if (typeof window === 'undefined') return;
  const garden = getGarden().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(garden));
}

export function toggleFavorite(bouquetId) {
  if (typeof window === 'undefined') return false;
  try {
    const favs = getFavorites();
    const idx = favs.indexOf(bouquetId);
    if (idx === -1) {
      favs.push(bouquetId);
    } else {
      favs.splice(idx, 1);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return idx === -1;
  } catch {
    return false;
  }
}

export function getFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isFavorite(bouquetId) {
  return getFavorites().includes(bouquetId);
}

export function incrementViews(encodedData) {
  if (typeof window === 'undefined') return 0;
  try {
    const key = `views_${encodedData.slice(0, 30)}`;
    const views = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, views.toString());
    return views;
  } catch {
    return 0;
  }
}

export function getViews(encodedData) {
  if (typeof window === 'undefined') return 0;
  try {
    const key = `views_${encodedData.slice(0, 30)}`;
    return parseInt(localStorage.getItem(key) || '0');
  } catch {
    return 0;
  }
}

export function incrementAppreciations(encodedData) {
  if (typeof window === 'undefined') return 0;
  try {
    const key = `appreciations_${encodedData.slice(0, 30)}`;
    const count = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count.toString());
    return count;
  } catch {
    return 0;
  }
}

export function getAppreciations(encodedData) {
  if (typeof window === 'undefined') return 0;
  try {
    const key = `appreciations_${encodedData.slice(0, 30)}`;
    return parseInt(localStorage.getItem(key) || '0');
  } catch {
    return 0;
  }
}

export function hasAppreciated(encodedData) {
  if (typeof window === 'undefined') return false;
  try {
    const key = `appreciated_${encodedData.slice(0, 30)}`;
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function setAppreciated(encodedData) {
  if (typeof window === 'undefined') return;
  try {
    const key = `appreciated_${encodedData.slice(0, 30)}`;
    localStorage.setItem(key, 'true');
  } catch {}
}

export function saveScheduled(bouquetData, scheduledDate) {
  if (typeof window === 'undefined') return;
  try {
    const scheduled = getScheduled();
    scheduled.push({ data: bouquetData, date: scheduledDate, sent: false });
    localStorage.setItem(STORAGE_KEYS.SCHEDULED, JSON.stringify(scheduled));
  } catch {}
}

export function getScheduled() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
