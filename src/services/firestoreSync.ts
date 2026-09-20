import { db, isRealFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';

/**
 * Firebase Firestore Persistence Helper for PTENit & Marketplace
 * Automatically synchronizes changes to Firestore with real cloud persistence,
 * with fallback to local state so the app works seamlessly online and offline.
 */

export const isFirebaseConfigured = () => {
  return isRealFirebaseConfigured();
};

/**
 * Persist or update a single document in Firestore
 */
export async function syncDocToFirestore(collectionName: string, docId: string, data: any) {
  try {
    if (!docId || !data) return;
    const docRef = doc(db, collectionName, String(docId));
    // Clean any undefined keys before sending to Firestore
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, {
      ...cleanData,
      _lastUpdated: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Could not sync ${collectionName}/${docId}:`, error);
    return false;
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteDocFromFirestore(collectionName: string, docId: string) {
  try {
    if (!docId) return;
    const docRef = doc(db, collectionName, String(docId));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Could not delete ${collectionName}/${docId}:`, error);
    return false;
  }
}

/**
 * Batch synchronize an entire collection (e.g. on updates or seeds)
 */
export async function syncCollectionToFirestore(collectionName: string, items: any[], idField: string = 'id') {
  try {
    if (!Array.isArray(items) || items.length === 0) return;
    const batch = writeBatch(db);
    // Firestore batch limit is 500 operations
    const chunk = items.slice(0, 450);
    for (const item of chunk) {
      const docId = String(item[idField] || item.id);
      if (docId) {
        const docRef = doc(db, collectionName, docId);
        const cleanItem = JSON.parse(JSON.stringify(item));
        batch.set(docRef, { ...cleanItem, _lastSynced: new Date().toISOString() }, { merge: true });
      }
    }
    await batch.commit();
    return true;
  } catch (error) {
    console.warn(`[Firestore Sync] Batch error on ${collectionName}:`, error);
    return false;
  }
}

/**
 * Load all documents from a Firestore collection
 */
export async function loadCollectionFromFirestore<T = any>(collectionName: string): Promise<T[] | null> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list: T[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
      });
      return list;
    }
    return null;
  } catch (error) {
    console.warn(`[Firestore Load] Could not load ${collectionName}:`, error);
    return null;
  }
}
