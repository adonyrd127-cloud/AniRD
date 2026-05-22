import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { db, dbService } from '../db.js';

vi.mock('../auth.service.js', () => ({
  authService: {
    isLoggedIn: vi.fn(() => false),
    syncWithServer: vi.fn(),
  }
}));

describe('dbService.addToHistory', () => {
  beforeEach(async () => {
    // Recreate tables to ensure clear state before each test
    await db.history.clear();
    vi.spyOn(dbService, 'triggerSync').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds a new history entry when none exists', async () => {
    const result = await dbService.addToHistory('anime1', 'ep1', 500, 1000);

    expect(result).toBeDefined();

    const historyItems = await db.history.toArray();
    expect(historyItems.length).toBe(1);

    const item = historyItems[0];
    expect(item.animeId).toBe('anime1');
    expect(item.episodeId).toBe('ep1');
    expect(item.progress).toBe(500);
    expect(item.duration).toBe(1000);
    expect(item.timestamp).toBeDefined();
    expect(item.updatedAt).toBeDefined();

    expect(dbService.triggerSync).toHaveBeenCalledTimes(1);
  });

  it('updates an existing history entry when it already exists', async () => {
    // Add initial entry
    await dbService.addToHistory('anime2', 'ep2', 100, 1500);

    const initialItems = await db.history.toArray();
    const initialItem = initialItems[0];

    vi.spyOn(Date, 'now').mockReturnValue(initialItem.updatedAt + 10000);

    // Update existing entry
    const result = await dbService.addToHistory('anime2', 'ep2', 600, 1500);

    expect(result).toBeDefined();

    const finalItems = await db.history.toArray();
    expect(finalItems.length).toBe(1); // Should still be 1

    const finalItem = finalItems[0];
    expect(finalItem.animeId).toBe('anime2');
    expect(finalItem.episodeId).toBe('ep2');
    expect(finalItem.progress).toBe(600);
    expect(finalItem.duration).toBe(1500);
    expect(finalItem.updatedAt).toBeGreaterThan(initialItem.updatedAt);

    expect(dbService.triggerSync).toHaveBeenCalledTimes(2);
  });
});
