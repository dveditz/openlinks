//
// Open Selected Links web extension
//
// URL/Link helper extension, primarily for dealing with mass links.
// The extension adds context menus to handle links in various ways,
// especially bulk actions on multiple selected links
//

browser.runtime.onInstalled.addListener( initialize );
browser.contextMenus.onClicked.addListener( menuListener );

function initialize() {
  // "Open selected links"
  // opens selected links in background tabs.
  browser.contextMenus.create({
                                id: "openselectedlinks",
                                title: "Open selected links",
                                contexts: [ "selection" ],
                              });

  // "View link source"
  // the link under the cursor is opened as a `view-source:` URL
  browser.contextMenus.create({
                                id: "openviewsource",
                                title: "View link source",
                                contexts: [ "link" ],
                              });
}

// handle the menu clicks
async function menuListener( info, tab ) {
  
  switch (info.menuItemId) {

    case "openselectedlinks": {
      if ( !tab ) {
        // Can't inject the link-gathering script without a tabId
        console.warn("Open Selected Links: menuListener called without a tab");
        break;
      }
      let results = await browser.scripting.executeScript({
                            target: { tabId: tab.id, allFrames: true },
                            files: ["/openlinks_content.js"] });
      for ( let result of results ) {
        if ( result.result ) {
          for ( url of result.result ) {
            browser.tabs.create( makeTabinfo( tab, url ) );
          }
        }
      }
      break;
    }

    case "openviewsource": {
      let tabinfo = makeTabinfo( tab, "view-source:" + info.linkUrl );
      tabinfo.active = true;
      browser.tabs.create( tabinfo );
      break;
    }

    default:
      console.error(`Open Selected Links: unknown menuItemId ${info.menuItemId}`);
  }
}

function makeTabinfo( tab, url ) {
  let info = {};
  if ( tab ) {
    info.windowId = tab.windowId;
    info.openerTabId = tab.id;
    info.cookieStoreId = tab.cookieStoreId;
    info.active = false;
  }
  if ( url )
    info.url = url;
  
  return info;
}
