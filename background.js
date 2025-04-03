chrome.webRequest.onBeforeRequest.addListener(
    function(details) { 
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Site was blocked',
            message: 'Blocked site: ' + details.url
        });
        console.log("Blocked site: " + details.url);
        return { cancel: true}
    },
    { urls: ["*://*.zedo.com/*", "*://*.doubleclick.net/*", "*://*.google-analytics.com/*", "*://*.ru/*", "*://*.cn/*", "*://*.tiktok.com/*", "*://*.tiktokcdn.com/*", "*://*.tiktokv.com/*", "*://*.tiktok.com/*", "*://*.tiktokapi.com/*", "*://*.tiktokcdn.com/*", "*://*.tiktokv.com/*", "*://*.temu.com/*", "*://*.rf/*"] },
    ["blocking"]
)