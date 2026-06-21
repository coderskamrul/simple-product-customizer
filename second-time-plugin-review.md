You changed the plugin display name to  **"OptionFlow for WooCommerce"** .

## It's time to move forward with the plugin review "pluginshift"!

 **Your plugin is not yet ready to be approved** , you are receiving this email because the volunteers have manually checked it and have found some issues in the code / functionality of your plugin.

Please  **check this email thoroughly** , address any issues listed, test your changes, and upload a corrected version of your code if all is well.

## List of issues found

### ![🔴](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f534/32.png) Trialware and Locked Features

Please review your plugin to ensure that it  **does not include any locked or restricted built-in functionality** . This is not permitted under the [WordPress.org Plugin Directory Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/) you agreed to when submitting the plugin.

#### ![❌](https://fonts.gstatic.com/s/e/notoemoji/17.0/274c/32.png) Guideline 5 – Trialware

Plugins must be fully functional. You may not:

* Lock, disable or limit built-in features behind a license key, trial period, usage limit, time, quota or any other kind of intended restriction.

Even if the locked feature is present in the code "just in case the user upgrades," it’s still  **not allowed** . Your plugin may point out which features are available through a separated plugin, but that's it. All plugin code hosted on WordPress.org must be  **free and fully functional** .

#### ![🌐](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f310/32.png) Guideline 6 – Serviceware

Plugins may connect to a  **legitimate external service to perform certain functionality** , provided:

* The service performs actual processing on external servers.
* The functionality provided cannot be done locally by the plugin.
* The service is clearly documented in your readme, including **Terms of Use** and **Privacy Policy** links.

For example: a "Spam checker" plugin that connects to a external service to check for spam (and thus uses it to provide that functionality) is generally acceptable. A plugin that simply checks a license key to unlock local features is not.

#### ![✅](https://fonts.gstatic.com/s/e/notoemoji/17.0/2705/32.png) Ask yourself:

* Does any function  **only work after a license check or payment** ?
* Is any functionality in the plugin code **disabled or limited** until it’s unlocked?
* Are there any limitations on the plugin  **after a certain amount of time or usage** ?

After excluding functionalities provided by legitimate external services, if the answer is ***yes*** to any of the above, the plugin  **does not comply** .

#### ![🔧](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f527/32.png) How to fix it:

* **Remove all license checks** or other mechanisms that control access to features built in in the plugin code.
* **Remove or fully enable** any built in features that are currently locked or limited.
* Make sure external services are compliant and clearly documented.

#### ![ℹ️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2139_fe0f/32.png) Important clarification:

WordPress.org is  **not a marketplace** . It's a repository for  **free, fully functional, GPL-compliant plugins** .

If you are not offering a service and want to offer additional features through a paid version, that code must be:

* **Hosted elsewhere** (e.g., your own website).
* **Not included** in the plugin hosted on WordPress.org.
* **GPL compliant** : Do **not** include any mechanisms that would prevent a plug-in from being used after a license has been checked.

```
 Advanced formula evaluation and several Pro pricing behaviors are implemented in this codebase but intentionally withheld by delegating them to Pro-only hooks/registration instead of enabling the local functionality directly.
```

![⚠️](https://fonts.gstatic.com/s/e/notoemoji/17.0/26a0_fe0f/32.png)

 The AI has highlighted the most apparent issues. There may be additional concerns not explicitly mentioned. You **must** read and comprehend the guidelines and  **review the entire code thoroughly to ensure that there are no other issues** .
![❗](https://fonts.gstatic.com/s/e/notoemoji/17.0/2757/32.png)

 If more issues of the same nature are found in the following review,  **this plugin will not be reviewed again** . Ensure full compliance with the guidelines to avoid rejection.

**## No publicly documented resource for your generated/compressed content**

In reviewing your plugin, we cannot find a non-compiled version of your javascript and/or css related source code.

In order to comply with our guidelines of human-readable code, we require you to include the source code and / or a link to the source code, this is true for your own code and for developer libraries you’ve included in your plugin. If you include a link, this may be in your source code, however we require you to also have it in your readme.

[https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/#4-code-must-be-mostly-human-readable](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/#4-code-must-be-mostly-human-readable)

We strongly feel that one of the strengths of open source is the ability to review, observe, and adapt code. By maintaining a public directory of freely available code, we encourage and welcome future developers to engage with WordPress and push it forward.

That said, with the advent of larger and larger plugins using more complex libraries, people are making good use of build tools (such as composer or npm) to generate their distributed production code. In order to balance the need to keep plugin sizes smaller while still encouraging open source development, we require plugins to make the source code to any compressed files available to the public in an easy to find location, by documenting it in the readme.

For example, if you’ve made a Gutenberg plugin and used npm and webpack to compress and minify it, you must either include the source code within the published plugin or provide access to a public maintained source that can be reviewed, studied, and yes, forked.

![🔗](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f517/32.png)

 If you choose to add a link to a repository, please make sure that the repository exists and is publicly accessible. **We will check those links** in the next review.

We strongly recommend you include directions on the use of any build tools to encourage future developers.

From your plugin:

```
assets/build/admin.js:1  ...(()=>{var e,t,n={990(){"use strict";"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undef... 
#  Generated build file assets/build/admin.js is referenced but no matching human-readable source or public repository link is provided
assets/build/admin.js:3  ...n Ze(e){return null==e?"—":`${e>0?"+":""}${e}%`}function et(e,t){const n=new Date(`${e}T00:00:00`);return Number.isNaN(n.getTime())?e:t<=8?n.toLocaleDateString(void 0,{weekday:"short"}):`${n.getMont... 
#  Generated build file assets/build/admin.js is referenced but no matching human-readable source or public repository link is provided
assets/build/store.js:1  ...(()=>{"use strict";var e={990(){"function"!=typeof Object.assign&&(Object.assign=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(!e)throw TypeError("Cannot convert undefined... 
#  Generated build file assets/build/store.js is referenced but no matching human-readable source or public repository link is provided
```

**## Calling core loading files directly**

Calling core files like wp-config.php, wp-blog-header.php, wp-load.php directly via an include is not permitted.

These calls are prone to failure as not all WordPress installs have the exact same file structure. In addition it opens your plugin to security issues, as WordPress can be easily tricked into running code in an unauthenticated manner.

Your code should always exist in functions and be called by action hooks. This is true even if you need code to exist outside of WordPress. Code should only be accessible to people who are logged in and authorized, if it needs that kind of access. Your plugin's pages should be called via the dashboard like all the other settings panels, and in that way, they'll always have access to WordPress functions.

[https://developer.wordpress.org/plugins/hooks/](https://developer.wordpress.org/plugins/hooks/)

There are some exceptions to the rule in certain situations and for certain core files. In that case, we expect you to use `require_once` to load them and to use a function from that file immediately after loading it.

If you are trying to "expose" an endpoint to be accessed directly by an external service, you have some options.

* You can expose a 'page' use [query_vars](https://developer.wordpress.org/reference/hooks/query_vars/) and/or [rewrite rules](https://developer.wordpress.org/apis/rewrite/) to create a virtual page which calls a function.  *[A practical example](https://codepen.io/the_ruther4d/post/custom-query-string-vars-in-wordpress)* .
* You can create an [AJAX endpoint](https://developer.wordpress.org/plugins/javascript/ajax/).
* You can create a [REST API endpoint](https://developer.wordpress.org/rest-api/).

Example(s) from your plugin:

```
includes/Rest/Route/PluginController.php:83 require_once ABSPATH . 'wp-admin/includes/misc.php';
#  Loads wp-admin/includes/misc.php inside the REST callback without any subsequent use from that file, so the core include is not shown to be necessary.
```

**## Internationalization: Text domain does not match plugin slug.**

In order to make a string translatable in your plugin you are using a set of special functions. These functions collectively are known as "gettext".

These functions have [a parameter called &#34;text domain&#34;](https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/#text-domains), which is a unique identifier for retrieving translated strings.

This "text domain" must be the same as your plugin slug so that the plugin can be translated by the community using the tools provided by the directory. As for example, if this plugin slug is "shiftkit-option-sets" the Internationalization functions should look like:
`esc_html__( 'Hello', 'shiftkit-option-sets' );`

From your plugin, you have set your text domain as follows:

```
# This plugin is using the domain "optionflow-for-woocommerce" for 98 element(s).
```

However, the current plugin slug is this:

```
shiftkit-option-sets
```

**## Data Must be Sanitized, Escaped, and Validated**

When you include POST/GET/REQUEST/FILE calls in your plugin, it's important to sanitize, validate, and escape them. The goal here is to prevent a user from accidentally sending trash data through the system, as well as protecting them from potential security issues.

**SANITIZE:** Data that is input (either by a user or automatically) must be sanitized as soon as possible. This lessens the possibility of XSS vulnerabilities and MITM attacks where posted data is subverted.

**VALIDATE:** All data should be validated, no matter what. Even when you sanitize, remember that you don’t want someone putting in ‘dog’ when the only valid values are numbers.

**ESCAPE:** Data that is output must be escaped properly when it is echo'd, so it can't hijack admin screens. There are many esc_*() functions you can use to make sure you don't show people the wrong data.

To help you with this, WordPress comes with a number of sanitization and escaping functions. You can read about those here:

* [https://developer.wordpress.org/apis/security/sanitizing/](https://developer.wordpress.org/apis/security/sanitizing/)
* [https://developer.wordpress.org/apis/security/escaping/](https://developer.wordpress.org/apis/security/escaping/)

Remember: You must use the most appropriate functions for the context. If you’re sanitizing email, use `sanitize_email()`, if you’re outputting HTML, use `wp_kses_post()`, and so on.

An easy mantra here is this:

Sanitize *early*
Escape *Late*
*Always* Validate

Clean everything, check everything, escape everything, and never trust the users to always have input sane data. After all, users come from all walks of life.

Example(s) from your plugin:

```
includes/Integration/WooCommerce/CartHooks.php:126 $linked     = isset( $_POST['oflw_linked_products'] ) ? Str::json( wp_unslash( $_POST['oflw_linked_products'] ), array() ) : array();
 -----> wp_unslash($_POST['oflw_linked_products'])
#  oflw_linked_products is only JSON-decoded and stored into cart item data without sanitizing the nested user-controlled values first
includes/Integration/WooCommerce/CartHooks.php:124 $raw_json   = isset( $_POST['oflw_field_data'] ) ? Str::unslash( wp_unslash( $_POST['oflw_field_data'] ) ) : '';
 -----> wp_unslash($_POST['oflw_field_data'])
#  Raw oflw_field_data from POST is unslashed and then stored in cart item data as oflw_field_data_raw without sanitizing the user-supplied JSON first
```

 **Note: There are simple ways to sanitize arrays** , in case you need to do so, you can do the following:

* An array of post IDs: `array_unique(array_map('<wbr/>absint', $_POST['post_ids']))`
* An array of emails: `array_map('sanitize_email', $_POST['user_emails'])`
* A multidimensional array, being all the elements texts: `map_deep( $_POST['arrays_of_texts'], 'sanitize_text_field' )`

Sometimes you'll have an array that contains  **different types of data inside** , which would require different types of sanitization.

```

$sanitized_orders = $_POST['orders']; // Sanitized below.
array_walk_recursive( $sanitized_orders, 'optifowo_sanitize_orders' );
function optifowo_sanitize_orders( &$item , $key ){
  switch ($key){
    case 'locator':
      $item = sanitize_key($item);
      break;
    case 'name':
      $item = sanitize_text_field($item);
      break;
    case 'price':
    case 'priceDiscounted':
      $item = (float)$item;
      break;
    default:
      $item = NULL;
  }
}
```

We have heuristically detected these cases of your plugin that might need array sanitization (might be false positives, please check them out):

```
includes/Integration/WooCommerce/CartHooks.php:126 $linked     = isset( $_POST['oflw_linked_products'] ) ? Str::json( wp_unslash( $_POST['oflw_linked_products'] ), array() ) : array();
includes/Integration/WooCommerce/CartHooks.php:125 $set_ids    = isset( $_POST['oflw_published_set_ids'] ) ? Str::json( wp_unslash( $_POST['oflw_published_set_ids'] ), array() ) : array();
```

![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

 You can check this using [Plugin Check](https://wordpress.org/plugins/plugin-check/).

**## Variables and options must be escaped when echo'd**

Much related to sanitizing everything, all variables that are echoed need to be escaped when they're echoed, so it can't hijack users or (worse) admin screens. There are many esc_*() functions you can use to make sure you don't show people the wrong data, as well as some that will allow you to echo HTML safely.

At this time, we ask you escape  **all $-variables, options, and any sort of generated data when it is being echoed** . That means you should not be escaping when you build a variable, but when you output it at the end. We call this 'escaping late.'

Besides protecting yourself from a possible XSS vulnerability, escaping late makes sure that you're keeping the future you safe. While today your code may be only outputted hardcoded content, that may not be true in the future. By taking the time to properly escape **when** you echo, you prevent a mistake in the future from becoming a critical security issue.

This remains true of options you've saved to the database. Even if you've properly sanitized when you saved, the tools for sanitizing and escaping aren't interchangeable. Sanitizing makes sure it's safe for processing and storing in the database. Escaping makes it safe to output.

Also keep in mind that sometimes a function is echoing when it should really be returning content instead. This is a common mistake when it comes to returning JSON encoded content. Very rarely is that actually something you should be echoing at all. Echoing is because it needs to be on the screen, read by a human. Returning (which is what you would do with an API) can be json encoded, though remember to **sanitize** when you save to that json object!

There are a number of options to secure all types of content (html, email, etc). Yes, even HTML needs to be properly escaped.

[https://developer.wordpress.org/apis/security/escaping/](https://developer.wordpress.org/apis/security/escaping/)

Remember: You must use the most appropriate functions for the context. There is pretty much an option for everything you could echo. Even echoing HTML safely.

Example(s) from your plugin:

```
includes/Frontend/StoreRenderer.php:154 echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- All dynamic parts escaped at source (field render, esc_attr below).
 -----> echo $html;
# ↳ Detected origin: sprintf('<div class="oflw-options oflw-loading" data-product-id="%d">', $product_id)
# ↳ Remember to ALWAYS escape as LATE as possible as with a PROPER function for the context.
#  The final HTML blob is echoed unescaped and includes rendered field output that is not uniformly escaped, including raw shortcode output paths.
includes/Frontend/StoreRenderer.php:129 $inner
#  The aggregated field markup is inserted raw, and at least ShortcodeField appends do_shortcode output without escaping, so $inner is not guaranteed safely escaped.
```

 **Note** : When escaping, there are cases where your plugin will need to output HTML. This can be done using the functions `wp_kses_post` or `wp_kses`. The function `wp_kses_post` will allow any common HTML that can go inside a post content, `wp_kses` will allow any HTML that you set up using its second and third parameters, please [refer to its documentation](https://developer.wordpress.org/reference/functions/wp_kses/).

A common mistake is to use `esc_html` to escape HTML. This function is not intended for that, it's intended to escape the output that will go **inside** an HTML tag, therefore it will strip any HTML tags.

Examples:

```
echo wp_kses_post($html_content);

echo wp_kses($html_content, array( 'a', 'div', 'span' ));
```

We have heuristically detected these cases of your plugin that might need HTML escaping (might be false positives, please check them out):

```
includes/Frontend/StoreRenderer.php:154 echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- All dynamic parts escaped at source (field render, esc_attr below).
 -----> $html
```

![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

 You can check this using [Plugin Check](https://wordpress.org/plugins/plugin-check/).

**## Generic function/class/define/namespace/option names**

All plugins must have unique function names, namespaces, defines, class and option names. This prevents your plugin from conflicting with other plugins or themes. We need you to update your plugin to use more unique and distinct names.

A good way to do this is with a prefix. For example, if your plugin is called "OptionFlow for WooCommerce" then you could use names like these:

* function optifowo_save_post(){ ... }
* class OPTIFOWO_Admin { ... }
* update_option( 'optifowo_options', $options );
* add_shortcode( 'optifowo_shortcode', $callback );
* register_setting( 'optifowo_settings', 'optifowo_user_id', ... );
* define( 'OPTIFOWO_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
* global $optifowo_options;
* add_action('wp_ajax_ **optifowo_** save_data', ... );
* namespace pluginshift\shiftkitoptionsets;

*Disclaimer: These are just examples that may have been self-generated from your plugin name, we trust you can find better options. If you have a good alternative, please use it instead, this is just an example.*

The prefix should be **at least four (4) characters long** (don't try to use two- or three-letter prefixes anymore). We host almost 100,000 plugins on WordPress.org alone. There are tens of thousands more outside our servers. Believe us, you're likely to encounter conflicts.

You also need to avoid the use of __ (double underscores), wp_ , or _ (single underscore) as a prefix. Those are reserved for WordPress itself. You can use them inside your classes, but not as stand-alone function.

Please remember, if you're using _n() or __() for translation, that's fine. We're **only** talking about functions you've created for your plugin, not the core functions from WordPress. In fact, those core features are why you need to not use those prefixes in your own plugin! You don't want to break WordPress for your users.

Related to this, using if (!function_exists('NAME')) { around all your functions and classes sounds like a great idea until you realize the fatal flaw. If something else has a function with the same name and their code loads first, your plugin will break. Using if-exists should be reserved for shared libraries only.

Remember: Good prefix names are unique and distinct to your plugin. This will help you and the next person in debugging, as well as prevent conflicts.

Analysis result:

```
# This plugin is using the prefix "oflw" for 40 element(s).
# This plugin is using the prefix "option_flow" for 18 element(s).

# Using the common word "option" as a prefix.
includes/Core/Container.php:8 namespace OptionFlow\Core
includes/Core/Settings.php:8 namespace OptionFlow\Core
includes/Core/Uninstaller.php:8 namespace OptionFlow\Core
includes/Core/Plugin.php:8 namespace OptionFlow\Core
includes/Core/Capabilities.php:8 namespace OptionFlow\Core
includes/Core/Installer.php:8 namespace OptionFlow\Core
includes/Core/Assets.php:8 namespace OptionFlow\Core
includes/Frontend/StoreAssets.php:8 namespace OptionFlow\Frontend
includes/Frontend/StoreRenderer.php:8 namespace OptionFlow\Frontend
includes/Integration/WooCommerce/ProductPanel.php:8 namespace OptionFlow\Integration\WooCommerce
includes/Integration/WooCommerce/ShopLoop.php:8 namespace OptionFlow\Integration\WooCommerce
includes/Integration/WooCommerce/CheckoutHooks.php:8 namespace OptionFlow\Integration\WooCommerce
includes/Integration/WooCommerce/CartHooks.php:8 namespace OptionFlow\Integration\WooCommerce
includes/Integration/WooCommerce/OrderHooks.php:8 namespace OptionFlow\Integration\WooCommerce
includes/Integration/WooCommerce/Compatibility.php:8 namespace OptionFlow\Integration\WooCommerce
includes/Admin/AdminMenu.php:8 namespace OptionFlow\Admin
includes/Admin/AdminAssets.php:8 namespace OptionFlow\Admin
includes/Admin/AdminNotices.php:8 namespace OptionFlow\Admin
includes/Support/Str.php:8 namespace OptionFlow\Support
includes/Support/Upload.php:8 namespace OptionFlow\Support
includes/Support/Money.php:8 namespace OptionFlow\Support
includes/Support/Countries.php:12 namespace OptionFlow\Support
includes/Support/Arr.php:8 namespace OptionFlow\Support
includes/Formula/ArithmeticEvaluator.php:15 namespace OptionFlow\Formula
includes/Formula/Ast/ExpressionEngine.php:18 namespace OptionFlow\Formula\Ast
includes/Formula/Ast/Token.php:12 namespace OptionFlow\Formula\Ast
includes/Formula/Ast/Parser.php:21 namespace OptionFlow\Formula\Ast
includes/Formula/Ast/EvaluationError.php:8 namespace OptionFlow\Formula\Ast
includes/Formula/Ast/Lexer.php:24 namespace OptionFlow\Formula\Ast
includes/Formula/Ast/Node/UnaryNode.php:8 namespace OptionFlow\Formula\Ast\Node
includes/Formula/Ast/Node/FunctionNode.php:21 namespace OptionFlow\Formula\Ast\Node
includes/Formula/Ast/Node/BinaryNode.php:15 namespace OptionFlow\Formula\Ast\Node
includes/Formula/Ast/Node/NumberNode.php:8 namespace OptionFlow\Formula\Ast\Node
includes/Formula/Ast/Node/NodeInterface.php:8 namespace OptionFlow\Formula\Ast\Node
includes/Formula/Ast/Node/VariableNode.php:8 namespace OptionFlow\Formula\Ast\Node
includes/Fields/FieldContract.php:8 namespace OptionFlow\Fields
includes/Fields/AbstractField.php:8 namespace OptionFlow\Fields
includes/Fields/Type/LinkedProductsField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/ShortcodeField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/HeadingField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/DatetimeField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/ImageSwatchField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/RangeField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/UrlField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/NumberField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/ToggleField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/TelField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/PopupField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/FileUploadField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/ColorPickerField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/RadioField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/SpacerField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/SectionField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/EmailField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/TextField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/FormulaField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/HtmlField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/DateField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/CheckboxField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/ColorSwatchField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/SelectField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/TimeField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/DividerField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/TextareaField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/Type/ButtonGroupField.php:8 namespace OptionFlow\Fields\Type
includes/Fields/FieldRegistry.php:8 namespace OptionFlow\Fields
includes/Fields/Concerns/HandlesPricing.php:8 namespace OptionFlow\Fields\Concerns
includes/Fields/Concerns/RendersMarkup.php:8 namespace OptionFlow\Fields\Concerns
includes/Data/OptionSetRepository.php:8 namespace OptionFlow\Data
includes/Data/Sanitizer.php:8 namespace OptionFlow\Data
includes/Data/AssignmentResolver.php:8 namespace OptionFlow\Data
includes/Pricing/TaxBridge.php:8 namespace OptionFlow\Pricing
includes/Pricing/PriceCalculator.php:8 namespace OptionFlow\Pricing
includes/Pricing/Currency/CurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency
includes/Pricing/Currency/Adapter/WooPaymentsAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/WpmlMultiCurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/MudraAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/XCurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/ManualRevert.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/WoocsAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/WpWhamAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/WooMultiCurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/WcMultiCurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/YithCurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/CurcyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/PriceByCountryAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/AeliaAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/WowStoreAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/Adapter/YayCurrencyAdapter.php:8 namespace OptionFlow\Pricing\Currency\Adapter
includes/Pricing/Currency/CurrencyBridge.php:8 namespace OptionFlow\Pricing\Currency
includes/Rest/Route/SearchController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/PluginController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/StyleController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/SetsController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/AnalyticsController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/AssignmentController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/FontsController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/UploadController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/Route/SettingsController.php:8 namespace OptionFlow\Rest\Route
includes/Rest/RestServer.php:8 namespace OptionFlow\Rest
includes/Analytics/CleanupCron.php:8 namespace OptionFlow\Analytics
includes/Analytics/StatsRepository.php:8 namespace OptionFlow\Analytics
# Using the common word "woocommerce" as a prefix.
includes/Pricing/Currency/Adapter/CurcyAdapter.php:34 apply_filters('woocommerce_product_addons_option_price_raw', $price, '');
# Using the common word "wc" as a prefix.
includes/Pricing/Currency/Adapter/AeliaAdapter.php:43 apply_filters('wc_aelia_cs_base_currency', '');
includes/Pricing/Currency/Adapter/AeliaAdapter.php:57 apply_filters('wc_aelia_cs_convert', $price, $this->base_currency, $this->active_currency);
includes/Pricing/Currency/Adapter/AeliaAdapter.php:71 apply_filters('wc_aelia_cs_convert', $price, $this->active_currency, $this->base_currency);

# Looks like there are elements not using common prefixes.
includes/Pricing/Currency/Adapter/WpmlMultiCurrencyAdapter.php:34 $woocommerce_wpml;
includes/Pricing/Currency/Adapter/WoocsAdapter.php:30 apply_filters('woocs_convert_price', $price, '');
includes/Pricing/Currency/Adapter/WoocsAdapter.php:44 apply_filters('woocs_back_convert_price', $price, '');
includes/Pricing/Currency/Adapter/YithCurrencyAdapter.php:33 apply_filters('yith_wcmcs_convert_price', $price, '');
includes/Pricing/Currency/Adapter/CurcyAdapter.php:34 apply_filters('woocommerce_product_addons_option_price_raw', $price, '');
includes/Pricing/Currency/Adapter/AeliaAdapter.php:43 apply_filters('wc_aelia_cs_base_currency', '');
includes/Pricing/Currency/Adapter/AeliaAdapter.php:57 apply_filters('wc_aelia_cs_convert', $price, $this->base_currency, $this->active_currency);
includes/Pricing/Currency/Adapter/AeliaAdapter.php:71 apply_filters('wc_aelia_cs_convert', $price, $this->active_currency, $this->base_currency);
includes/Pricing/Currency/Adapter/YayCurrencyAdapter.php:30 apply_filters('yay_currency_convert_price', $price, '');
includes/Pricing/Currency/Adapter/YayCurrencyAdapter.php:44 apply_filters('yay_currency_revert_price', $price, '');
```

**## Unsafe SQL calls**

When making database calls, it's highly important to protect your code from SQL injection vulnerabilities. You need to update your code to use wpdb calls and prepare() with your queries to protect them.

Please review the following:* [https://developer.wordpress.org/reference/classes/wpdb/#protect-queries-against-sql-injection-attacks](https://developer.wordpress.org/reference/classes/wpdb/#protect-queries-against-sql-injection-attacks)

* [https://codex.wordpress.org/Data_Validation#Database](https://codex.wordpress.org/Data_Validation#Database)
* [https://make.wordpress.org/core/2012/12/12/php-warning-missing-argument-2-for-wpdb-prepare/](https://make.wordpress.org/core/2012/12/12/php-warning-missing-argument-2-for-wpdb-prepare/)
* [https://ottopress.com/2013/better-know-a-vulnerability-sql-injection/](https://ottopress.com/2013/better-know-a-vulnerability-sql-injection/)

Example(s) from your plugin:

```


includes/Analytics/StatsRepository.php:267 $wpdb->prepare(
"UPDATE `{$table}` SET `{$metric}` = %f WHERE id = %d",
$new,
(int) $row['id']
)
includes/Analytics/StatsRepository.php:266 $wpdb->query(
$wpdb->prepare(
"UPDATE `{$table}` SET `{$metric}` = %f WHERE id = %d",
$new,
(int) $row['id']
)
);
# There is a call to a wpdb::prepare() function, that's correct.
# You cannot add variables like "$metric" directly to the SQL query.
# Using wpdb::prepare($query, $args) you will need to include placeholders for each variable within the query and include the variables in the second parameter.

includes/Analytics/StatsRepository.php:211 $wpdb->prepare(
"UPDATE `{$table}` SET `{$metric}` = %d WHERE id = %d",
$new,
(int) $row['id']
)
includes/Analytics/StatsRepository.php:210 $wpdb->query(
$wpdb->prepare(
"UPDATE `{$table}` SET `{$metric}` = %d WHERE id = %d",
$new,
(int) $row['id']
)
);
# There is a call to a wpdb::prepare() function, that's correct.
# You cannot add variables like "$metric" directly to the SQL query.
# Using wpdb::prepare($query, $args) you will need to include placeholders for each variable within the query and include the variables in the second parameter.
```

## ![👉](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f449/32.png) Continue with the review process.

### Read this email thoroughly.

Take the time to thoroughly review and understand the issues identified. Examine the provided examples, consult the relevant documentation, and conduct any additional research necessary. The goal of our review process is to help you clearly understand the reported issues so you can resolve them effectively and prevent similar problems in future updates to your plugin.
*Note that there may be false positives - we are humans and make mistakes, we apologize if there is anything we have gotten wrong. If you have doubts you can ask us for clarification, when asking us please be clear, concise, direct and include an example.*

### ![📋](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f4cb/32.png) Complete your checklist.

![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

 **I fixed all the issues** in my plugin based on the feedback I received and my own review, as I know that the Plugins Team may not share all cases of the same issue. **I am familiar with tools** such as Plugin Check, PHPCS + WPCS, and similar utilities to help me identify problems in my code.
![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

 **I tested my updated plugin on a clean WordPress installation** with [WP_DEBUG set to true](https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/).

> **![⚠️](https://fonts.gstatic.com/s/e/notoemoji/17.0/26a0_fe0f/32.png) Do not skip this step.** Testing is essential to make sure your fixes actually work and that you haven’t introduced new issues.

![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

 **I acknowledge that this review will be rejected** if I overlook the issues or fail to test my code.
![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

  **I went to [&#34;Add your plugin&#34;](https://wordpress.org/plugins/developers/add/) and uploaded the updated version** .  *I can continue updating the code there throughout the review process — the team will always check the latest version* .
![✔️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2714_fe0f/32.png)

 I replied to **this** email. I was concise and shared any clarifications or important context that the team needed to know.
*I didn't list all the changes, as the team will review the entire plugin again and that is not necessary at all.*

![ℹ️](https://fonts.gstatic.com/s/e/notoemoji/17.0/2139_fe0f/32.png)

 To help speed up the review process, we kindly ask that you  **carefully verify and address all reported issues before resubmitting your code** .
