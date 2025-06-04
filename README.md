# Open Selected Links
[open selected links extension](https://addons.mozilla.org/en-US/firefox/addon/open-selected-links/)
 
This extension adds context menu items to deal with links found in a web page selection. The main functionality is to open all of the selected HTML links in new tabs. If there are no HTML links it will open any text URLs it can find in the selection. As a last resort, and specific to Firefox development, it will treat 5-7 digit numbers as bugzilla.mozilla.org bug IDs and open those as tabs. If the cursor is directly on a link it you also have the option to open a view-source tab for that link.

## Changes
### Version 1.0
* The add-on no longer injects a content-script into all urls. Instead it uses the `activeTab` and `scripting` permissions to inject the content-script only into the tabs where the user activated the contentMenu item.
* Combined the "selected" and "text" link functionality to avoid unnecessary sub-menus
* New tabs are created in the container ("cookieStoreId") of the tab with the selection. This required adding the `cookies` permission
* View-source tabs are now opened as a foreground tab instead of in the background
* Converted to Manifest v3
### Version 0.9
The original version
 

