This is the "WowAddons - Product Addons for WooCommerce" plugin.
You will act as a Senior WordPress Plugin Developer, WooCommerce Architecture Expert, and Full Stack Plugin Engineer.

The goal is to fully replicate and rebuild the functionality, workflow, features, UX behavior, and overall plugin system of "WowAddons - Product Addons for WooCommerce" as a completely new standalone plugin with a different architecture, different coding style, different naming convention, different UI implementation, and different internal structure.

This project must be developed in a way where the final plugin behaves similarly in functionality but does NOT look like a direct copy-paste implementation at code level.

CORE FUNCTIONAL GOAL:

- Create a dynamic single product page customization system
- Allow users to add custom product options with different pricing rules
- Support multiple pricing strategies (fixed, percentage, conditional, quantity-based, and dynamic rules)
- Provide a flexible UI for product personalization
- Enable advanced conditional logic for showing/hiding options
- Allow real-time price updates on product page
- Integrate deeply with WooCommerce cart and checkout system
- you can see in "WowAddons - Product Addons for WooCommerce"



The plugin should be:

Plugin Folder Name:
dynamic-product-options-for-woocommerce
	|-dynamic-product-options-for-woocommerce.php

- Fully production-ready
- Scalable
- Modular
- Modern
- Secure
- Optimized
- Maintainable
- WooCommerce compatible
- HPOS compatible
- Built with a completely different engineering approach

Important Development Strategy:

- Replicate all core features, workflows, logic flow, addon systems, admin management, frontend behavior, cart integration, pricing logic, conditional logic, and WooCommerce integrations from the original plugin.
- Do NOT directly duplicate raw source code, naming structures, database structure names, function names, CSS class names, React component names, hooks, file structures, or internal architecture.
- Rebuild everything using a fresh architecture and cleaner engineering patterns.
- Use alternative implementation strategies whenever possible.
- Refactor and redesign internal systems so the final codebase appears as a completely independent plugin implementation.
- The final plugin must not contain obvious copy-paste traces from the original plugin.

You are running inside Claude Code AI with multi-agent capability.

Use parallel agents/workers to divide and execute tasks simultaneously, including:

1. Plugin architecture planning
2. WooCommerce integration analysis
3. React admin UI development
4. Frontend addon rendering
5. Database & settings architecture
6. REST API development
7. Cart & checkout integration
8. SCSS styling system
9. Security & sanitization review
10. Optimization & performance review
11. Compatibility testing
12. Refactoring & code quality validation

Each agent should work independently but maintain shared architecture consistency.

==================================================
ENVIRONMENT & TOOLING REQUIREMENTS
==================================

Node & Frontend Requirements:

1. Use modern React JS architecture.
2. Use SCSS for styling.
3. Use reusable component-based design.
4. Use WordPress-compatible React setup.
5. Use @wordpress/scripts or equivalent modern tooling.
6. Use Vite/Webpack optimization if necessary.
7. Use proper asset bundling and code splitting.

Node Version Requirements:
8. Use Node.js v20 environment.
9. Before frontend setup, run:
   `nvm use 20`
10. Ensure all frontend tooling and packages are compatible with Node v20.
11. Use npm or pnpm consistently throughout the project.

==================================================
PLUGIN ARCHITECTURE REQUIREMENTS
================================

1. Create the plugin as a fully new WordPress plugin.
2. Use completely unique:

   - Plugin name
   - Prefix
   - Namespace
   - Text domain
   - Constants
   - Database keys
   - Hooks
   - REST routes
   - AJAX actions
   - Asset handles
   - CSS classes
   - React component names
   - PHP class names
   - Function names
3. Follow:

   - WordPress Coding Standards (WPCS)
   - WooCommerce best practices
   - PSR-4 autoloading
   - OOP architecture
4. Organize project structure cleanly:
   /admin
   /frontend
   /core
   /api
   /assets
   /blocks
   /templates
   /includes
   /modules
   /helpers
   /integrations
5. Use modular feature-based architecture.

==================================================
WOOCOMMERCE REQUIREMENTS
========================

1. Build specifically as WooCommerce extension plugin.
2. Add WooCommerce dependency validation.
3. Prevent activation without WooCommerce.
4. Support:

   - Simple products
   - Variable products
   - Product variations
   - AJAX cart
   - Checkout flow
   - Cart item meta
   - Order item meta
   - Dynamic pricing
   - Conditional fields
   - File upload addons
   - Quantity-based pricing
   - Custom addon logic
5. Ensure compatibility with:

   - HPOS
   - Latest WooCommerce versions
   - Latest WordPress versions

==================================================
ADMIN UI REQUIREMENTS
=====================

1. Build modern admin dashboard with React JS.
2. Rebuild UI from scratch with different structure/design implementation.
3. Extract logic from bundled/minified JS carefully and redesign components.
4. Use reusable React components.
5. Use dynamic state management.
6. Build responsive UI.
7. Use scalable SCSS architecture.
8. Add clean UX improvements where possible.
9. Avoid direct visual cloning of original plugin admin UI.

==================================================
SECURITY & PERFORMANCE REQUIREMENTS
===================================

1. Sanitize all input data.
2. Escape all output properly.
3. Add nonce verification everywhere needed.
4. Add capability checks.
5. Build secure REST APIs and AJAX endpoints.
6. Avoid unnecessary database queries.
7. Load assets conditionally.
8. Optimize frontend rendering.
9. Use lazy loading where possible.
10. Minimize performance overhead.

==================================================
DEVELOPER EXPERIENCE REQUIREMENTS
=================================

1. Do NOT generate everything at once.
2. Start by analyzing original plugin architecture.
3. Then generate:

   - Full folder structure
   - System design
   - Database strategy
   - React architecture
   - WooCommerce integration plan
4. After architecture approval:

   - Build module-by-module
   - Keep code maintainable
   - Add comments for important logic
   - Explain reasoning where needed
5. Always prefer clean engineering over quick implementation.

==================================================
IMPORTANT RULES
===============

- Never use direct copy-paste code.
- Never keep original plugin naming patterns.
- Never keep identical file structure.
- Never keep identical React architecture.
- Never keep identical CSS structure.
- Refactor everything into a cleaner engineering pattern.
- Preserve functionality while changing implementation style.
- Keep plugin enterprise-grade and scalable.
