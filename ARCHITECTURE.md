# Dynamic Product Options for WooCommerce — Architecture & Naming Contract

This is the single source of truth every build module must follow. The plugin is a
ground-up, independent re-implementation of a WooCommerce product-options builder.
No identifiers, file layout, class names, CSS classes, REST routes, hooks, or data
keys are shared with any prior implementation. PHP and JS are both authored here, so
the contract below is internally self-consistent and authoritative.

## 1. Identity

| Thing | Value |
|---|---|
| Plugin Name | Dynamic Product Options for WooCommerce |
| Folder / slug | `dynamic-product-options-for-woocommerce` |
| Main file | `dynamic-product-options-for-woocommerce.php` |
| Text domain | `dynamic-product-options-for-woocommerce` |
| PHP namespace root | `DPO\` (PSR-4, StudlyCase filenames, `src/` root) |
| Hook / option / meta prefix | `dpo_` |
| Constant prefix | `DPO_` |
| REST namespace | `dpo/v1` |
| Nonce action | `dpo_rest` |
| Nonce REST header | `X-WP-Nonce` (WP standard) |
| CSS class prefix | `dpo-` |
| Admin React mount id | `dpo-admin-root` |
| Admin JS global | `window.dpoAdmin` |
| Store JS global | `window.dpoStore` |
| Public JS surface | `window.dpoPricingState`, `window.dpoEvaluateFormula` |

## 2. Constants (defined in main file)

`DPO_VERSION`, `DPO_FILE`, `DPO_PATH` (trailingslashit), `DPO_URL` (trailingslashit),
`DPO_BASENAME`, `DPO_ASSETS` (`DPO_URL . 'assets/build/'`), `DPO_MIN_WC` (`'7.0'`),
`DPO_MIN_PHP` (`'7.4'`).

## 3. PSR-4 layout (namespace `DPO\` → `src/`)

```
src/Core/        Plugin, Container, ServiceProvider, Assets, Capabilities,
                 Installer, Uninstaller, Settings, Logger
src/Data/        OptionSetRepository (CPT wrapper), AssignmentResolver, Sanitizer
src/Fields/      FieldContract (interface), AbstractField, FieldRegistry,
                 Concerns/RendersMarkup, Concerns/HandlesPricing,
                 Type/* (one class per option type)
src/Pricing/     PriceCalculator, TaxBridge,
                 Currency/CurrencyBridge, Currency/Adapter/* (one per integration),
                 Currency/CurrencyAdapter (interface)
src/Formula/     ArithmeticEvaluator (simple), Ast/ExpressionEngine, Ast/Lexer,
                 Ast/Token, Ast/Parser, Ast/Node/* , Ast/EvaluationError
src/Rest/        RestServer, Route/* (controllers grouped by concern)
src/Integration/ WooCommerce/CartHooks, WooCommerce/CheckoutHooks,
                 WooCommerce/OrderHooks, WooCommerce/ShopLoop,
                 WooCommerce/ProductPanel, WooCommerce/Compatibility
src/Frontend/    StoreRenderer, StoreAssets
src/Admin/       AdminMenu, AdminAssets, AdminNotices, Telemetry
src/Analytics/   StatsRepository, CleanupCron
src/Support/     Str, Money, Arr, Upload (static helpers)
```

Autoload filename = exact class short name + `.php` (PSR-4, StudlyCase). Example:
`DPO\Fields\Type\CheckboxField` → `src/Fields/Type/CheckboxField.php`.

## 4. Database / storage keys

### Custom post type
- Post type: `dpo_option_set` (public=false, show_ui=false, supports title/editor,
  show_in_rest=true). One post = one "Option Set" (a tree of fields + assignment).

### Post meta on `dpo_option_set`
| key | shape |
|---|---|
| `_dpo_fields` | JSON string: ordered array of Field nodes (see §6) |
| `_dpo_assignment` | JSON string: `{scope, include:[], exclude:[]}` |
| `_dpo_field_css` | string (generated per-set CSS) |
| `_dpo_required` | JSON string: `{ fieldId: {type} }` precomputed required map |

### Post meta on WC product
| key | shape |
|---|---|
| `_dpo_assigned_include` | JSON array of option-set IDs explicitly assigned |
| `_dpo_assigned_exclude` | JSON array of option-set IDs explicitly excluded |

### Term meta (taxonomies product_cat, product_tag, product_brand)
| key | shape |
|---|---|
| `_dpo_term_assigned` | JSON array of option-set IDs assigned to that term |

### Options (wp_options)
| key | shape / default |
|---|---|
| `dpo_settings` | assoc array (see §10) |
| `dpo_assign_all` | JSON array of option-set IDs applied to every product |
| `dpo_global_style` | assoc array (style tokens) |
| `dpo_global_style_css` | string |
| `dpo_global_style_thematic` | assoc array |
| `dpo_global_style_thematic_css` | string |
| `dpo_custom_fonts` | array of `{id,title,src,family,file_type}` |
| `dpo_product_image_map` | assoc `{optionSetId: [attachmentIds]}` |
| `dpo_seeded` | bool flag (demo seed done) |
| `dpo_license_key` | string |
| `dpo_license_data` | array, key `status` ∈ valid|expired|'' |
| `dpo_db_version` | string |

### Transients
Prefix `dpo_t_`. Notice dismissals `dpo_notice_<key>`. Country cache `dpo_geo_cc`.

### Stats tables
- `{prefix}dpo_stats` — `id`(PK AI), `set_id` bigint KEY, `impressions` int,
  `clicks` int, `add_to_cart` int, `orders` int, `revenue` double.
- `{prefix}dpo_stats_daily` — `id`(PK AI), `day` date KEY, `impressions`,
  `clicks`, `add_to_cart`, `orders`, `revenue` double.

### Uploads
`wp-uploads/dpo_uploads/{temp,order_placed,order_completed}/`,
fonts `wp-uploads/dpo_fonts/`.

### Cron
Hook `dpo_cleanup_uploads`, schedule `daily`.

## 5. Capabilities & nonce

- Read endpoints capability: filter `dpo_cap_read` (default `manage_options`).
- Write endpoints capability: filter `dpo_cap_manage` (default `manage_options`).
- All mutating REST calls verify `X-WP-Nonce` (WP cookie auth) AND, for multipart
  uploads, a body field `dpo_nonce` with `wp_verify_nonce($n, 'dpo_rest')`.
- Public endpoints (file upload from storefront, analytics ping) use
  `permission_callback => __return_true` plus the `dpo_rest` body nonce.

## 6. Field node JSON shape (`_dpo_fields`)

Ordered array. Each node:

```jsonc
{
  "id": "f_<base36>",            // unique per set
  "type": "<type slug, §7>",
  "parent": "",                  // section id or "" for top level
  "label": "",
  "description": "",
  "descriptionPlacement": "below_label|tooltip|below_field",
  "placeholder": "",
  "hideLabel": false,
  "required": false,
  "width": "full|half|third|two-third|quarter",
  "cssClass": "",
  "pricePlacement": "with_label|with_choice",
  "logicEnabled": false,
  "logic": { "action": "show|hide", "match": "all|any",
             "rules": [ { "source":"<fieldId>", "operator":"<op>", "value":"" } ] },
  "defaults": [],                // selected indexes / default value
  "choices": [                   // choice/priced types
    { "label":"", "priceMode":"none|flat|percent|per_unit|per_char|per_char_nospace|per_word",
      "regular":"", "sale":"", "selected":false, "uid":"",
      "image":"", "imageId":0, "color":"", "fontFamily":"", "formulaValue":"" }
  ],
  "config": { /* type-specific keys, §7 */ },
  "children": [ /* nested nodes, section type only */ ]
}
```

`operator` vocabulary: `is`, `is_not`, `empty`, `not_empty`, `contains`,
`not_contains`, `gt`, `lt`, `gte`, `lte`, `starts_with`, `between`, `checked`.

## 7. Field type slugs (FieldRegistry keys == runtime type == JS type)

`text`, `textarea`, `email`, `url`, `tel`, `number`, `checkbox`, `radio`,
`select`, `toggle`, `range`, `date`, `time`, `datetime`, `colorpicker`,
`colorswatch`, `imageswatch`, `fontpicker`, `fileupload`, `heading`, `html`,
`divider`, `spacer`, `section`, `buttongroup`, `popup`, `shortcode`,
`linkedproducts`, `formula`, `advancedformula`.

(Generic, industry-standard slugs; each is its own class — no polymorphic/alias
hacks. `select` runtime type stays `select`.)

Price modes per choice: `none, flat, percent, per_unit, per_char,
per_char_nospace, per_word`. Pro-gated modes (degrade to `flat` when license
inactive): `percent, per_unit, per_word, per_char_nospace`. Sale price honored
only when license active. `advancedformula`, `fontpicker` are Pro-only (render
nothing when inactive). Free tier caps: choices per field = 3, linked products = 2.

## 8. Frontend DOM contract (PHP renders, store JS consumes)

- Wrapper: `<div class="dpo-options dpo-loading" data-product-id>`.
- Per option-set: `<div class="dpo-set" data-set-id>`.
- Per field: `<div class="dpo-field dpo-field--{type}" id="dpo-field-{fieldId}"
  data-field-id data-type data-logic data-required data-logic-rules
  data-price-mode data-defaults>`. Hidden-by-logic adds class `dpo-hidden`.
- Hidden inputs inside `form.cart`:
  `dpo_field_data` (JSON of selections), `dpo_linked_products`,
  `dpo_published_set_ids`, `dpo_shipping_dynamics`.
- Price spans: `#dpo-options-price`, `#dpo-options-total`, base price holders
  `#dpo-base-price`, `#dpo-base-price-pct`, `#dpo-variation-prices`,
  `#dpo-variation-prices-pct`, `#dpo-product-attributes`.
- Input name pattern: `dpo_input_{fieldId}` (single), choice groups
  `dpo_choice_{fieldId}`.

## 9. Selection JSON (`dpo_field_data` POST + cart meta `dpo_field_data`)

Map keyed by fieldId:
```jsonc
{ "<fieldId>": {
    "type":"<type>", "setId": <int>, "label":"",
    "value": <scalar | [labels] | [{label,count}] | {date,time} | [{name,path}] | "#hex">,
    "choiceIndexes":[<int>...],          // choice types
    "dynamics": { }                       // advancedformula only
} }
```
Computed result (cart item meta `dpo_field_data`):
`{ price, breakdown:{ setId: subtotal }, lines:[ {name,value,_meta} ], setIds:[] }`.
Raw POST also stored as cart meta `dpo_field_data_raw` for totals recompute.
Linked products → `dpo_linked_products` cart meta, added as separate lines.

## 10. Settings keys (option `dpo_settings`)

`showPriceLine` (bool, def true), `priceLineLabel` (str, "Options Price"),
`showTotalLine` (bool, true), `totalLineLabel` (str, "Total Price"),
`hideInCart` (bool, false), `hideInCheckout` (bool, false),
`shopForceSelect` (bool, true), `shopButtonText` (str, "Select Options"),
`uploadTempDays` (int, 7), `uploadPlacedDays` (int, 0),
`uploadCompletedDays` (int, 0).

## 11. REST routes (base `/wp-json/dpo/v1/`)

Read (cap `dpo_cap_read`): `sets` (GET list), `set/(?P<id>...)` (GET one),
`assignment/(?P<id>)` (GET), `style` (GET), `settings` (GET), `fonts` (GET),
`analytics` (GET), `search/products` (GET), `search/terms` (GET),
`product-link` (GET).
Write (cap `dpo_cap_manage` + nonce): `set` (POST upsert),
`set/(?P<id>)` (DELETE), `sets/bulk` (POST status/delete/duplicate/import),
`assignment` (POST), `style` (POST), `settings` (POST),
`font` (POST upload), `font/(?P<id>)` (DELETE/PATCH), `plugin/install` (POST).
Public (nonce only): `upload` (POST multipart), `analytics/hit` (POST).

Envelope: success `{ ok:true, ...payload }`, error
`new WP_Error('dpo_*', msg, ['status'=>4xx])` (REST serializes it).

## 12. Hooks (extensibility surface — all `dpo_` prefixed)

Actions: `dpo_booted`, `dpo_set_saved`, `dpo_set_deleted`,
`dpo_stats_record` (set_id, metric, amount), `dpo_enqueue_store_assets`,
`dpo_cleanup_uploads`. Filters: `dpo_cap_read`, `dpo_cap_manage`,
`dpo_resolved_set_ids` (ids, product_id), `dpo_price_choice`
(price,mode,ctx), `dpo_upload_mimes`, `dpo_allowed_html`,
`dpo_currency_convert`, `dpo_currency_revert`.

## 13. Pricing math (PriceCalculator)

Per chosen choice, `cost = (license_active && sale!=='') ? sale : regular`:
- `none` → 0
- `flat` → cost
- `percent` → product_price * cost / 100  (product_price pre-tax, currency-reverted)
- `per_unit` → quantity_of_choice * cost (choice count; numeric fields use value)
- `per_char` → mb_strlen(value) * cost
- `per_char_nospace` → mb_strlen(value w/o spaces) * cost
- `per_word` → str_word_count(value) * cost
- `formula` → ArithmeticEvaluator (`{{var}}` + `%`, arithmetic only)
- `advancedformula` → Ast\ExpressionEngine (`[var]` + funcs/comparisons)
Sum across fields = options unit price. `set_price(product_base + options)`,
pre-tax, never × quantity (WC multiplies). Currency: store base currency;
revert WC price to base for percent math; convert final via CurrencyBridge.

## 14. Build

Node 20 (`.nvmrc`), `@wordpress/scripts`. `npm run build` →
`assets/build/admin.js`, `assets/build/store.js`, `assets/build/*.css`
(+ `*.asset.php`). PHP enqueues from `assets/build/` using the generated
`.asset.php` for deps/version. Admin app deps include react/wp-element/
wp-components/wp-api-fetch/wp-i18n. Source under `assets/src/`.
