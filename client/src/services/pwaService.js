let serviceWorkerRegistration = null;
let reloadStarted = false;
let updateAvailable = false;

const announceUpdate = () => {
  updateAvailable = true;
  window.dispatchEvent(new CustomEvent("taxfin:update-available"));
};

export function hasTaxFinUpdate() {
  return updateAvailable;
}

export async function registerTaxFinServiceWorker() {
  if (!("serviceWorker" in navigator) || import.meta.env.DEV) {
    return null;
  }

  serviceWorkerRegistration = await navigator.serviceWorker.register(
    "/sw.js",
    { updateViaCache: "none" }
  );

  if (serviceWorkerRegistration.waiting) {
    announceUpdate();
  }

  serviceWorkerRegistration.addEventListener("updatefound", () => {
    const installingWorker = serviceWorkerRegistration.installing;

    installingWorker?.addEventListener("statechange", () => {
      if (
        installingWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        announceUpdate();
      }
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloadStarted) {
      return;
    }

    reloadStarted = true;
    window.location.reload();
  });

  window.addEventListener("focus", () => {
    serviceWorkerRegistration?.update().catch(() => {});
  });

  return serviceWorkerRegistration;
}

export function activateTaxFinUpdate() {
  serviceWorkerRegistration?.waiting?.postMessage({ type: "SKIP_WAITING" });
}
