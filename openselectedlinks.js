//
// Open Selected Links web extension
//
// URL/Link helper extension, primarily for dealing with mass links.
// The extension adds context menus to handle links in various ways,
// especially bulk actions on multiple selected links
//


//
// openUrls
//
// Given an <urllist> array open each in a new background tab
// relative to the passed in <tab>
//
function openUrls( urllist, tab ) {
  console.log("openUrls: " + urllist);

  let tabId = tab.index;
  for ( url of urllist ) {
    chrome.tabs.create(
      {
        windowId: tab.windowId,
        index: ++tabId,
        url: url,
        active: false
      }
    )
  }
}


//
// Open selected links
//
// a context menu item that opens selected HTML links in background tabs.
// Since a background script can't see page content we have to ask
// the tab that was clicked to return it to us.
//
chrome.contextMenus.create( {
                              id: "openselectedlinks",
                              title: "Open selected links",
                              contexts: [ "selection" ],
                              onclick: openselectedlinks
                            } );

function openselectedlinks( info, tab ) {
  console.log( "openselectedlinks: menu clicked" );
  
  // prior to bug 1250631 tab was part of the info object
  if ( !tab ) { tab = info.tab; }

  chrome.tabs.sendMessage(
    tab.id,
    "getSelectedLinks",
    (results) => { openUrls( results, tab ); }
  )
}


//
// Open selected text links
//
// A context menu item that opens a background tab for each "url-looking"
// bit of text in the selection. URLs are restricted to "web" and file
// schemes, but otherwise the regexp used is definitely of the
// "worse is better" philosophy.
//
chrome.contextMenus.create( {
                              id: "opentextlinks",
                              title: "Open selected text links",
                              contexts: [ "selection" ],
                              onclick: opentextlinks
                            } );

function opentextlinks( info, tab ) {
  console.log( "opentextlinks selection: " + info.selectionText );

  // prior to bug 1250631 tab was part of the info object
  if ( !tab ) { tab = info.tab; }

  // regexp looks for webby schemes and then simply slurps text
  // until a space or likely text delimiter is found

  let urlfinder = /((?:https?|ftp|file):\/\/[^\s"\)\]\>]*)/g;
  let urls = info.selectionText.match( urlfinder );
  openUrls( urls, tab )
}


//
// View link source
//
// a context menu that opens a view-source: background tab for the
// link that was clicked on. This works in Firefox 45/46 but was broken
// in Firefox 47 when bug 1172165 made the view-source: protocol handler
// only loadable by privileged contexts. I've requested this functionality
// be restored to WebExtensions in bug 1261289
//
chrome.contextMenus.create( {
                              id: "openviewsource",
                              title: "View link source",
                              contexts: [ "link" ],
                              onclick: openviewsource
                            } );

function openviewsource( info, tab ) {
  console.log( "openviewsource menu clicked" );

  // prior to bug 1250631 tab was part of the info object
  if ( !tab ) { tab = info.tab; }

  // debugging sanity check -- it shouldn't happen
  if ( !info.linkUrl )
    throw "No URL for a LINK menu click!";
  
  chrome.tabs.create(
    {
      windowId: tab.windowId,
      index: tab.index + 1,
      url: "view-source:" + info.linkUrl,
      active: false
    }
  );
}