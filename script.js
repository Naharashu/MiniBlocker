chrome.storage.sync.get(['userSettings'], function(result) {
    const settings = result.userSettings || { enableNotifications: true, blockLevel: 'high' };
    document.getElementById('enableNotifications').checked = settings.enableNotifications;
    document.getElementById('blockLevel').value = settings.blockLevel;
});

document.getElementById('save').addEventListener('click', function() {
    const settings = {
        enableNotifications: document.getElementById('enableNotifications').checked,
        blockLevel: document.getElementById('blockLevel').value
    };
    chrome.storage.sync.set({userSettings: settings}, function() {
        alert('Settings saved!');
    });
});