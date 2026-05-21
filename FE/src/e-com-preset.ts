import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const ECommercePreset = definePreset(Aura, {
    semantic: {
        // ── Brand colour: Rose (warm, fashion-forward, bold) ────────────
        primary: {
            50:  "{rose.50}",
            100: "{rose.100}",
            200: "{rose.200}",
            300: "{rose.300}",
            400: "{rose.400}",
            500: "{rose.500}",
            600: "{rose.600}",
            700: "{rose.700}",
            800: "{rose.800}",
            900: "{rose.900}",
            950: "{rose.950}",
        },

        // ── Surface: Stone (warm paper-like neutrals) ────────────────────
        surface: {
            0:   "#ffffff",
            50:  "{stone.50}",
            100: "{stone.100}",
            200: "{stone.200}",
            300: "{stone.300}",
            400: "{stone.400}",
            500: "{stone.500}",
            600: "{stone.600}",
            700: "{stone.700}",
            800: "{stone.800}",
            900: "{stone.900}",
            950: "{stone.950}",
        },

        // ── Typography scale ─────────────────────────────────────────────
        // Generates: --p-typography-font-size-xs, --p-typography-font-size-sm, …
        typography: {
            fontFamily: "Inter var, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: {
                xs:   "0.75rem",
                sm:   "0.875rem",
                base: "1rem",
                lg:   "1.125rem",
                xl:   "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
            },
            fontWeight: {
                normal:   "400",
                medium:   "500",
                semibold: "600",
                bold:     "700",
            },
            lineHeight: {
                tight:   "1.25",
                base:    "1.5",
                relaxed: "1.75",
            },
        },

        // ── Border-radius scale ──────────────────────────────────────────
        // Keeps existing sm/base/lg/xl; adds 2xl and full.
        // Generates: --p-border-radius-sm, --p-border-radius-base, …
        border: {
            radius: {
                sm:   "4px",
                base: "6px",
                lg:   "8px",
                xl:   "12px",
                "2xl":"16px",
                full: "9999px",
            },
        },

        // ── Custom app tokens ────────────────────────────────────────────
        // Generates: --p-app-star-color, --p-app-overlay-mask, …
        app: {
            starColor:      "#f59e0b",
            overlayMask:    "rgba(0,0,0,0.40)",
            badgeDanger:    "{rose.700}",
            badgeWarning:   "{orange.500}",
            transitionFast: "100ms",
            transitionBase: "150ms",
            transitionSlow: "300ms",
            easing:         "cubic-bezier(0.4, 0, 0.2, 1)",
        },
    },

    // ── Component token overrides ────────────────────────────────────────
    components: {
        // Navbar
        toolbar: {
            root: {
                background: "{surface.0}",
                borderColor: "{surface.200}",
                padding: "0 1.5rem",
                gap: "0.5rem",
            },
        },

        // Buttons — align to radius scale, semibold labels
        button: {
            root: {
                paddingX:     "1rem",
                paddingY:     "0.5rem",
                borderRadius: "{border.radius.lg}",
                gap:          "0.4rem",
            },
        },

        // Inputs & selects
        inputtext: {
            root: {
                borderRadius: "{border.radius.lg}",
            },
        },
        select: {
            root: {
                borderRadius: "{border.radius.lg}",
            },
        },

        // Dialogs (login, register, confirm)
        dialog: {
            root: {
                borderRadius: "{border.radius.xl}",
                shadow:       "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            },
            header: {
                padding: "1.25rem 1.5rem",
            },
            content: {
                padding: "0 1.5rem 1.5rem",
            },
        },

        // Tags — order status, inventory status
        tag: {
            root: {
                borderRadius: "{border.radius.full}",
                fontSize:     "0.7rem",
                fontWeight:   "700",
                padding:      "0.2rem 0.6rem",
            },
        },

        // Badge — cart item count
        badge: {
            root: {
                borderRadius: "{border.radius.full}",
                fontSize:     "0.65rem",
                fontWeight:   "700",
                minWidth:     "1.1rem",
                height:       "1.1rem",
            },
        },

        // DataTable — transparent everywhere, consistent cell padding
        datatable: {
            root: {},
            row: {
                background: "transparent",
            },
            header: {
                background: "transparent",
            },
            footer: {
                background: "transparent",
            },
            headerCell: {
                background: "transparent",
                padding:    "0.75rem 1rem",
                color:      "{surface.500}",
            },
            bodyCell: {
                padding: "0.75rem 1rem",
            },
        },

        // Paginator — transparent, consistent radius
        paginator: {
            root: {
                background: "transparent",
                padding:    "0.5rem",
            },
            navButton: {
                borderRadius: "{border.radius.lg}",
            },
        },

        // Accordion — profile order history
        accordion: {
            panel: {
                borderColor: "{surface.200}",
                borderWidth: "0 0 1px 0",
            },
            header: {
                fontWeight: "600",
                padding:    "0.875rem 0",
                color:      "{surface.800}",
            },
            content: {
                padding: "0 0 1rem 0",
            },
        },

        // Tabs — profile tabs
        tabs: {
            tab: {
                fontWeight: "500",
            },
        },

        // Skeleton — match card radius
        skeleton: {
            root: {
                borderRadius: "{border.radius.lg}",
                background:   "{surface.200}",
            },
        },

        // Stepper — checkout flow
        stepper: {
            steppanel: {
                background: "transparent",
            },
            separator: {
                background: "{surface.200}",
            },
        },

        // Select (listbox, used internally by some components)
        listbox: {
            option: {
                focusBackground:         "{surface.100}",
                selectedFocusBackground: "{surface.200}",
                selectedBackground:      "{surface.100}",
            },
        },
    },
});

export default ECommercePreset;
