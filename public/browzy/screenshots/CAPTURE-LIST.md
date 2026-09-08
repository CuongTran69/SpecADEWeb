# Browzy screenshots

Images used by the Browzy pages (`/browzy`, `/browzy/install`, and their `/vi/`
mirrors). Filenames are referenced from `src/i18n/strings.ts` — change one here
and you must change it there too, in **both** the `en` and `vi` objects.

## In place

| File | Used on | Shows |
|---|---|---|
| `load-unpacked.png` | install guide, step 3 | The Browzy entry in `chrome://extensions`, enabled, with its fixed id `ihljfjgoakmoemkdondoaadegpmibimh` visible. |
| `panel-settings.png` | install guide, step 5 | The Settings screen: Base URL, API key field, model list, Test-connection button. |
| `panel-in-action.png` | product page, below the hero | The side panel open beside a real page, answering about that page's content. |

## Retaking one

Keep the same filename and the page picks it up with no code change.

**Before you publish any capture, look at it once for things that should not be
public:** an API key or token left visible in a field, a Base URL you would
rather not advertise, a bookmarks bar, an email address, a browser profile name,
or an open tab title from unrelated work. The three images above were checked —
the API key field is empty in `panel-settings.png`, which is why it was usable
as-is.

Recommended: a viewport around 1600×1000 at 1× or 2× DPI, the browser in dark
mode to match the site, and no OS chrome (window shadows, taskbar) in frame.

## Deliberately not illustrated

The `browzy doctor` section of the install guide has **no screenshot**, by
choice. Its output is plain text that the guide already reproduces and explains
line by line; a picture of a terminal would add nothing a reader could not
already see, and would go stale the moment the output format changed.
