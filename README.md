# Open Selected Links
[open selected links extension](https://addons.mozilla.org/en-US/firefox/addon/open-selected-links/)
 
This extension adds context menu items to deal with links found in a web page selection. Primarily all of the selected HTML links will be opened in new tabs. It can also open all the text URLs found in a selection. If the cursor is directly on a link it you also have the option to open a view-source tab for that link.

This is the initial "0.9" version that can be found on addons.mozilla.org. Several improvements are planned:
* switch to activeTab so we don't need \<all_urls\> permission
* only show Open Selected Text Links if there are some, so that most of the time people don't need to open a sub-menu to open selected links
* respect containers: currently new tabs are always opened in the default rather than the container used by the current page.
 

