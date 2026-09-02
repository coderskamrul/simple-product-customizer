=== Simple Product Customizer ===
Contributors: hasandev
Tags: product options, product addons, custom fields, conditional logic
Requires at least: 6.2
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Add custom option sets to WooCommerce products: swatches, uploads, conditional logic and formula pricing, with full cart and checkout support.

== Description ==

Simple Product Customizer adds a flexible option-set builder to any
WooCommerce product. Create reusable option sets, assign them to products,
categories, tags, brands, or the whole catalog, and let customers personalise
products with live price updates.

Features:

* 30 field types — text, textarea, email, url, tel, number, checkbox, radio,
  select, toggle, range, date, time, datetime, color picker, color & image
  swatches, font picker, file upload, heading, HTML, divider, spacer, section,
  button group, popup, shortcode, linked products, formula and advanced formula.
* Pricing modes per choice: flat, percentage, per unit, per character,
  per character (no spaces), per word, plus two formula engines.
* Conditional show/hide logic with a full operator set.
* React admin builder with drag-to-reorder canvas, inspector panels, live
  preview, assignment manager, global styling, analytics and settings.
* HPOS-compatible and Cart/Checkout-Blocks-compatible.
* Multi-currency switcher compatibility (14 popular switchers).
* Per-set analytics: impressions, clicks, add-to-cart and revenue.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/`.
2. Activate it through the *Plugins* screen.
3. Open *Product Options* in the admin menu to build your first option set.

== Development ==

The complete, unminified source is public:

https://github.com/coderskamrul/simple-product-customizer

Everything under `assets/build/` is generated from `assets/src/` by webpack via
`@wordpress/scripts`. Both the sources and the build output ship inside the
plugin, so nothing here is minified-only — the repository is provided so the
build can be reproduced and inspected independently.

**Build it yourself**

1. `git clone https://github.com/coderskamrul/simple-product-customizer.git`
2. `cd simple-product-customizer`
3. `nvm use` (Node 20+ is required; the version is pinned in `.nvmrc`)
4. `npm install`
5. `npm run build`

That regenerates `assets/build/` from `assets/src/`. No other build step is
needed: the PHP is plain PSR-4 with no compilation and no Composer runtime
dependencies.

**Run it locally**

Drop the folder into `wp-content/plugins/` of a WordPress site with
WooCommerce active, then activate it. For live rebuilds while editing the
React admin, use `npm run start` instead of `npm run build`.

Other scripts: `npm run pot` regenerates the translation template, and
`npm run zip` produces the distributable archive (`wp-cli` plus the
`dist-archive` package required).

== Frequently Asked Questions ==

= Does this require WooCommerce? =

Yes. WooCommerce must be installed and active; the plugin adds its option-set
builder to WooCommerce products.

= Is every feature free? =

Yes. There is no paid tier, no license key and no locked features — all 30
field types, both formula engines, conditional logic, analytics and the
multi-currency compatibility layer are included.

= Which files can customers upload? =

Images (PNG, JPG, HEIC), PDF, CSV, DOC and plain text. SVG is intentionally
not allowed, because an SVG can carry script and the upload endpoint is open
to storefront visitors. Sites that accept that risk can add it with the
`spcus_upload_mimes` filter.

= Where are uploaded files stored? =

In `wp-content/uploads/spcus_uploads/`, moved between buckets as the order
progresses. Retention per bucket is configurable in Settings.

= Does the plugin work with my multi-currency switcher? =

It ships adapters for 14 popular switchers, including Aelia, WOOCS, YITH,
Curcy, YayCurrency, WPML and WooPayments multi-currency.

== Upgrade Notice ==

= 1.0.0 =
Initial release.

== Changelog ==

= 1.0.0 =
* Initial release.
