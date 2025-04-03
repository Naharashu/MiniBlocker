let userSettings = {
    enableNotifications: true,
    blockLevel: 'high'
};

let currentBlockedSites = [];

chrome.storage.sync.get(['userSettings'], function(result) {
    userSettings = result.userSettings || userSettings;
});

let redirectUrl = "https://www.google.com/";
let redirectUrl2 = "https://www.youtube.com/";

const spamSites = [
    "*://*.4bidden.info/*",
    "*://*.agebooter.com/*",
    "*://*.alphastress.com/*",
    "*://*.anonboot.com/*",
    "*://*.anonsecurityteam.com/*",
    "*://*.anonymous-stresser.com/*",
    "*://*.anonymous-stresser.net/*",
    "*://*.api-stresser.me/*",
    "*://*.apocalypse-solutions.com/*",
    "*://*.arkbooter.fr/*",
    "*://*.assasinsbooter.altervista.org/*",
    "*://*.astrostress.com/*",
    "*://*.atom-stresser.com/*",
    "*://*.atomstress.org/*",
    "*://*.aurastresser.com/*",
    "*://*.avengestresser.com/*",
    "*://*.b-h.us/*",
    "*://*.battle.pw/*",
    "*://*.begayage-stresser.com/*",
    "*://*.bemybooter.eu/*",
    "*://*.best-ddos-tool.ilovecassola.it/*",
    "*://*.beststresser.com/*",
    "*://*.blink-stresser.000webhostapp.com/*",
    "*://*.blunter.xyz/*"
];    

const spamSites2 = [
    "*://*.acheter-des-bitcoin.com/*",
    "*://*.acytem.pw/*",
    "*://*.ad2bitcoin.com/*",
    "*://*.aeexc.lat/*",
    "*://*.airplus.website/*",
    "*://*.algo-revolution.com/*",
    "*://*.alt.litebonk.com/*",
    "*://*.alvarez.sfek.kz/*",
    "*://*.anc.coinpool.in/*",
    "*://*.api-stratum.bitcoin.cz/*",
    "*://*.api.bitcoin.cz/*",
    "*://*.api2.bitcoin.cz/*",
    "*://*.arsbitcoin.com/*",
    "*://*.asc.coinmine.pl/*",
    "*://*.au.ltcrabbit.com/*",
    "*://*.auroracoin.org/*",
    "*://*.autosurfdusoleil.com/*",
    "*://*.backup-pool1.com/*",
    "*://*.bfc.dsync.net/*",
    "*://*.bfgminer.org/*",
    "*://*.bibox.com/*",
    "*://*.bigzone.xyz/*",
    "*://*.binance.com/*",
    "*://*.binance2giga.link/*",
    "*://*.bitcanna.io/*",
    "*://*.bitclockers.com/*",
    "*://*.bitcoin-champion.com/*",
    "*://*.bitcoin-formation.club/*",
    "*://*.bitcoin-hausse.com/*",
    "*://*.bitcoin-pas-chere.com/*",
    "*://*.bitcoin-patrimoine.com/*",
    "*://*.bitcoin-server.de/*",
    "*://*.bitcoin-storm.com/*",
    "*://*.bitcoin.de/*",
    "*://*.bitcoin.it/*"
];

const blockedSitesHigh = [
    "*://*.zedo.com/*",
    "*://*.doubleclick.net/*",
    "*://*.google-analytics.com/*",
    "*://*.googlesyndication.com/*",
    "*://*.googleadservices.com/*",
    "*://*.googletagmanager.com/*",
    "*://*.googletagservices.com/*",
    "*://*.gstatic.com/*",
    "*://*.ad.doubleclick.net/*",
    "*://*.adservice.google.com/*",
    "*://*.adwords.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.ru/*",
    "*://*.com.ru/*",
    "*://*.co.ru/*",
    "*://*.net.ru/*",
    "*://*.org.ru/*",
    "*://*.su/*",
    "*://*.com.su/*",
    "*://*.co.su/*",
    "*://*.net.su/*",
    "*://*.org.su/*",
    "*://*.free/*",
    "*://*.cn/*",
    "*://*.tiktok.com/*",
    "*://*.tiktokcdn.com/*",
    "*://*.tiktokv.com/*",
    "*://*.tiktokapi.com/*",
    "*://*.tiktokcdn.com/*",
    "*://*.tiktokv.com/*",
    "*://*.temu.com/*",
    "*://*.temu.us/*",
    "*://*.temu.co/*",
    "*://*.temu.net/*",
    "*://*.rf/*",
    ...spamSites,
    ...spamSites2
];

const blockedSitesMedium = [
    "*://*.zedo.com/*",
    "*://*.doubleclick.net/*",
    "*://*.google-analytics.com/*",
    "*://*.googlesyndication.com/*",
    "*://*.googleadservices.com/*",
    "*://*.googletagmanager.com/*",
    "*://*.googletagservices.com/*",
    "*://*.gstatic.com/*",
    "*://*.ad.doubleclick.net/*",
    "*://*.adservice.google.com/*",
    "*://*.adwords.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.ru/*",
    "*://*.com.ru/*",
    "*://*.co.ru/*",
    "*://*.net.ru/*",
    "*://*.org.ru/*",
    "*://*.su/*",
    "*://*.com.su/*",
    "*://*.co.su/*",
    "*://*.net.su/*",
    "*://*.org.su/*",
    "*://*.cn/*",
    "*://*.tiktok.com/*",
    "*://*.rf/*",
    "*://*.temu.com/*",
    ...spamSites2
]

const blockedSitesLight = [
    "*://*.zedo.com/*",
    "*://*.doubleclick.net/*",
    "*://*.google-analytics.com/*",
    "*://*.googlesyndication.com/*",
    "*://*.googleadservices.com/*",
    "*://*.googletagmanager.com/*",
    "*://*.googletagservices.com/*",
    "*://*.gstatic.com/*",
    "*://*.ad.doubleclick.net/*",
    "*://*.adservice.google.com/*",
    "*://*.adwords.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.analytics.google.com/*",
    "*://*.ru/*",
    "*://*.com.ru/*",
    "*://*.co.ru/*",
    "*://*.net.ru/*",
    "*://*.org.ru/*",
    "*://*.su/*",
    "*://*.com.su/*",
    "*://*.co.su/*",
    "*://*.net.su/*",
    "*://*.org.su/*",
]

const patternCache = new Map();

function getRegexForPattern(pattern) {
    if (!patternCache.has(pattern)) {
        patternCache.set(pattern, new RegExp(pattern.replace(/\*/g, '.*')));
    }
    return patternCache.get(pattern);
}
function getBlockedSites() {
    switch(userSettings.blockLevel) {
        case 'light':
            return blockedSitesLight;
        case 'medium':
            return blockedSitesMedium;
        case 'high':
        default:
            return blockedSitesHigh;
    }
}


function updateBlockedSites() {
    switch(userSettings.blockLevel) {
        case 'light':
            currentBlockedSites = blockedSitesLight;
            break;
        case 'medium':
            currentBlockedSites = blockedSitesMedium;
            break;
        case 'high':
        default:
            currentBlockedSites = blockedSitesHigh;
            break;
    }
}

function loadSettings() {
    chrome.storage.sync.get(['userSettings'], function(result) {
        try {
            userSettings = result.userSettings || userSettings;
            updateBlockedSites();
            console.log('Settings loaded:', userSettings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    });
}
function handleRequest(details) {
    if (currentBlockedSites.some(pattern => {
        const regex = getRegexForPattern(pattern);
        const isBlocked = regex.test(details.url);
        console.log(`Checking pattern ${pattern}: ${isBlocked}`);
        return isBlocked;
    })) {
        console.log('URL blocked:', details.url);
        if (userSettings.enableNotifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'logo2.png',
                title: 'Site was blocked',
                message: 'Blocked site: ' + details.url
            });
        }
        if (details.url.includes("temu")) {  
            return { redirectUrl: redirectUrl };
        }
        if (details.url.includes("tiktok")) {  
            return { redirectUrl: redirectUrl2 };
        }
        return { cancel: true };
    }
    console.log('URL not blocked:', details.url);
    return { cancel: false };
}

loadSettings();


chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.userSettings) {
        try {
            userSettings = changes.userSettings.newValue;
            updateBlockedSites();
            console.log('Settings updated:', userSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    }
});


chrome.webRequest.onBeforeRequest.addListener(
    handleRequest,
    { urls: ["<all_urls>"] },
    ["blocking"]
);

