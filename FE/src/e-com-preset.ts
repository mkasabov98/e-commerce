// src/app/ecommerce-preset.ts
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const ECommercePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: "{stone.50}",
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
        surface: {
            50: "{gray.50}",
            100: "{gray.100}",
            200: "{gray.200}",
            300: "{gray.300}",
            400: "{gray.400}",
            500: "{gray.500}",
            600: "{gray.600}",
            700: "{gray.700}",
            800: "{gray.800}",
            900: "{gray.900}",
            950: "{gray.950}",
        },
        typography: {
            fontFamily: "{font.family.sans}",
            fontSize: {
                sm: "0.9375rem",
                base: "1.0rem",
            },
            fontWeight: {
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
            },
        },
        border: {
            radius: {
                sm: "4px",
                base: "6px",
                lg: "8px",
                xl: "12px",
            },
        },
    },
    components: {
        listbox: {
            option: {
                focusBackground: "white",
                selectedFocusBackground: "{surface.300}",
                selectedBackground: "{surface.300}",
            },
            list: {
                header: {
                    padding: "18px",
                },
            },
        },
        toolbar: {
            root: {
                background: "{surface.300}",
            },
        },
        button: {
            root: {
                paddingX: "8px",
                paddingY: "6px",
            },
        },
        paginator: {
            root: {
                background: "{surface:300}",
            },
        },
        datatable: {
            root: {
                // borderColor: "black",
            },
            row: {
                background: "transparent"
            },
            header: {
                // borderWidth: '1px',
                // borderColor: "black",
                background: "transparent"
            },
            footer: {
                background: "transparent",
                    // borderWidth: '1px',
                // borderColor: "black",
            },
            headerCell: {
                background: "transparent",
                // borderColor: "black",
            }
        }
    },
});

export default ECommercePreset;
