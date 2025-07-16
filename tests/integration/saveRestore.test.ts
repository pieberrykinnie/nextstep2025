import { test, expect } from '@playwright/test';

test.describe('Session Save/Restore', () => {
  test('should save and restore meeting data', async ({ page }) => {
    // Navigate to a test page
    await page.goto('https://meet.google.com');
    
    // Wait for the extension to load
    await page.waitForSelector('#limitlessmeet-root', { timeout: 10000 });
    
    // Simulate some meeting activity (captions, summary, actions)
    await page.evaluate(() => {
      // Simulate receiving captions
      chrome.runtime.sendMessage({ transcript: "Hello, welcome to the meeting." });
      chrome.runtime.sendMessage({ transcript: "Today we'll discuss the project timeline." });
      chrome.runtime.sendMessage({ transcript: "[ ] Schedule follow-up meeting" });
      
      // Simulate receiving summary
      chrome.runtime.sendMessage({ 
        summary: "Meeting discussed project timeline and scheduling.",
        actions: ["[ ] Schedule follow-up meeting"]
      });
    });
    
    // Wait for data to be processed
    await page.waitForTimeout(2000);
    
    // Verify data is displayed
    await expect(page.locator('#limitlessmeet-root')).toContainText('Hello, welcome to the meeting');
    await expect(page.locator('#limitlessmeet-root')).toContainText('Meeting discussed project timeline');
    await expect(page.locator('#limitlessmeet-root')).toContainText('Schedule follow-up meeting');
    
    // Refresh the page
    await page.reload();
    
    // Wait for extension to reload
    await page.waitForSelector('#limitlessmeet-root', { timeout: 10000 });
    
    // Verify data is restored
    await expect(page.locator('#limitlessmeet-root')).toContainText('Hello, welcome to the meeting');
    await expect(page.locator('#limitlessmeet-root')).toContainText('Meeting discussed project timeline');
    await expect(page.locator('#limitlessmeet-root')).toContainText('Schedule follow-up meeting');
  });
  
  test('should handle empty session gracefully', async ({ page }) => {
    await page.goto('https://meet.google.com');
    await page.waitForSelector('#limitlessmeet-root', { timeout: 10000 });
    
    // Verify extension loads without errors
    await expect(page.locator('#limitlessmeet-root')).toBeVisible();
    
    // Refresh and verify still works
    await page.reload();
    await page.waitForSelector('#limitlessmeet-root', { timeout: 10000 });
    await expect(page.locator('#limitlessmeet-root')).toBeVisible();
  });
});