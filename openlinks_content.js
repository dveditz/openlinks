//
// OpenSelectedLinks content_script
//
// When invoked it will gather all links found in the selection and return
// their hrefs as an array. Repeated URLs are coalesced to avoid a common
// annoyance in tablular data (particularly in bugzilla queries). Duplicates
// that are not adjacent will still result in duplicate tabs.
//
// If the selection has no HTML <a> elements then we gather text URLs.
//
// If neither kind of link is found then numbers found in the selection will
// be treated as bug references to https://bugzilla.mozilla.org.
//
{
  let results = [];
  let selection = window.getSelection();

  // We should only be called when we have a selection
  if (selection.type != "Range") {
    throw new Error("OpenSelectedLinks called without a selection");
  }

  // To find the HTML links we'll get all <a> elements found in the
  // commonAncestorContainer of the selection, and then filter those
  // to find the ones that are at least partially within the selection.
  //
  // I'm ignoring multiple ranges because this commonAncestor approach
  // can result in the same link being opened multiple times.

  let prevLink = "";
  const PARTIAL = true;

  let ancestor = selection.getRangeAt(0).commonAncestorContainer;
  if ( ancestor?.getElementsByTagName ) {
    // if we don't have getElementsByTabName we're probably in plain text
    for ( let link of ancestor.getElementsByTagName("a") ) {
      if ( selection.containsNode( link, PARTIAL ) && link.href != prevLink ) {
        results.push( link.href );
        prevLink = link.href;
      }
    }
  }

  if ( results.length == 0 ) {
    // No HTML links so look for text URLs.
    // If none of those either then look for numbers that might be bug IDs. We
    // handle multiple ranges so both types can be mixed in the same invocation.
    const urlfinder = /\bhttps?:\/\/[^\s"\)\]\>]*/ig;
    const bugnumbers = /(?<!\d)\d{5,7}(?!\d)/g; 
    const bugurl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
    
    for ( let r=0; r < selection.rangeCount; r++ ) {
      let rangetext = selection.getRangeAt( r ).toString();
      let texturls = rangetext.match( urlfinder );
      if ( texturls ) {
        texturls.forEach( (url) => results.push(url) );
      }
      else {
        let bugs = rangetext.match( bugnumbers );
        if ( bugs ) {
          bugs.forEach( (bug) => results.push( bugurl + bug ) );
        }
      }
    }
  }

  // return the content script results
  // console.debug("Open Selected Links: content-script results", results);
  results;
}
