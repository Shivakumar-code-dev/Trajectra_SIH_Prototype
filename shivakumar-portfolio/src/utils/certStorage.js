// Local persistence engine for uploaded certificate files using IndexedDB / LocalStorage fallback
const DB_NAME = 'ShivakumarPortfolioCerts';
const DB_VERSION = 1;
const STORE_NAME = 'certificates';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'certId' });
      }
    };
  });
}

export async function saveCertificateFile(certId, fileObj) {
  return new Promise(async (resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = {
          certId,
          fileName: fileObj.name,
          fileType: fileObj.type,
          dataUrl: e.target.result,
          uploadedAt: new Date().toISOString()
        };

        const db = await openDB();
        if (db) {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          const request = store.put(fileData);
          request.onsuccess = () => resolve(fileData);
          request.onerror = () => {
            // fallback to localStorage
            try {
              localStorage.setItem(`cert_${certId}`, JSON.stringify(fileData));
              resolve(fileData);
            } catch (err) {
              reject(err);
            }
          };
        } else {
          localStorage.setItem(`cert_${certId}`, JSON.stringify(fileData));
          resolve(fileData);
        }
      };
      reader.readAsDataURL(fileObj);
    } catch (err) {
      reject(err);
    }
  });
}

export async function getCertificateFile(certId) {
  return new Promise(async (resolve) => {
    try {
      const db = await openDB();
      if (db) {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(certId);
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            const local = localStorage.getItem(`cert_${certId}`);
            resolve(local ? JSON.parse(local) : null);
          }
        };
        request.onerror = () => {
          const local = localStorage.getItem(`cert_${certId}`);
          resolve(local ? JSON.parse(local) : null);
        };
      } else {
        const local = localStorage.getItem(`cert_${certId}`);
        resolve(local ? JSON.parse(local) : null);
      }
    } catch (err) {
      const local = localStorage.getItem(`cert_${certId}`);
      resolve(local ? JSON.parse(local) : null);
    }
  });
}

export async function deleteCertificateFile(certId) {
  const db = await openDB();
  if (db) {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(certId);
  }
  localStorage.removeItem(`cert_${certId}`);
}
