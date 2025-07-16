// extension/workers/storageWorker.ts
// IndexedDB session storage worker for autosaving meeting data.

declare const self: DedicatedWorkerGlobalScope;

interface SessionData {
  id: string;
  timestamp: number;
  captions: string[];
  summary: string;
  actions: string[];
}

interface SaveMsg {
  type: "save";
  data: Omit<SessionData, "id" | "timestamp">;
}

interface LoadMsg {
  type: "load";
  sessionId?: string;
}

interface ClearMsg {
  type: "clear";
  sessionId?: string;
}

let db: IDBDatabase | null = null;
const DB_NAME = "LimitlessMeetDB";
const STORE_NAME = "sessions";

async function initDB(): Promise<IDBDatabase> {
  if (db) return db;
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

async function saveSession(data: Omit<SessionData, "id" | "timestamp">): Promise<string> {
  const db = await initDB();
  const sessionId = `session_${Date.now()}`;
  const sessionData: SessionData = {
    id: sessionId,
    timestamp: Date.now(),
    ...data,
  };
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(sessionData);
    
    request.onsuccess = () => resolve(sessionId);
    request.onerror = () => reject(request.error);
  });
}

async function loadSession(sessionId?: string): Promise<SessionData | null> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    
    if (sessionId) {
      const request = store.get(sessionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    } else {
      // Load most recent session
      const index = store.index("timestamp");
      const request = index.openCursor(null, "prev");
      request.onsuccess = () => {
        const cursor = request.result;
        resolve(cursor ? cursor.value : null);
      };
      request.onerror = () => reject(request.error);
    }
  });
}

async function clearSession(sessionId?: string): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    if (sessionId) {
      const request = store.delete(sessionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    } else {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    }
  });
}

self.onmessage = async (e) => {
  const data = e.data as SaveMsg | LoadMsg | ClearMsg;
  
  try {
    switch (data.type) {
      case "save":
        const sessionId = await saveSession(data.data);
        self.postMessage({ type: "saved", sessionId });
        break;
      case "load":
        const session = await loadSession(data.sessionId);
        self.postMessage({ type: "loaded", session });
        break;
      case "clear":
        await clearSession(data.sessionId);
        self.postMessage({ type: "cleared" });
        break;
    }
  } catch (error) {
    self.postMessage({ type: "error", error: error.message });
  }
};