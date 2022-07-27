import { extendTheme } from "@chakra-ui/react";

const colors = {
  primary: {
      "50": "#F2F2F2",
      "100": "#DBDBDB",
      "200": "#C4C4C4",
      "300": "#ADADAD",
      "400": "#969696",
      "500": "#808080",
      "600": "#666666",
      "700": "#4D4D4D",
      "800": "#333333",
      "900": "#1A1A1A"
  },
  secondary: {
    "50": "#F0EBFA",
    "100": "#D4C6F1",
    "200": "#B9A1E8",
    "300": "#9E7CDF",
    "400": "#8257D6",
    "500": "#6732CD",
    "600": "#5228A4",
    "700": "#3E1E7B",
    "800": "#291452",
    "900": "#150A29"
  },
};

const theme = extendTheme({
  colors,
  styles: {
    global: {
      ":root": {
        "--swiper-navigation-color": "#fff",
      },
      "body, html": {
        display: "flex",
        minHeight: "100vh !important",
        flexDirection: "column",
      },
      "button:focus": {
        boxShadow: "none !important",
      },
      "select:focus": {
        borderColor: "#A5CC98 !important",
        boxShadow: "0 0 0 1px #A5CC98 !important",
      },
      "option[disabled]": {
        background: "#efeded !important",
      },
      a: {
        color: "primary.500",
      },
      ".wysiwyg img": {
        marginBottom: 10,
      },
      ".wysiwyg p": {
        marginBottom: "10px",
      },
      ".swiper-thumbs .swiper-slide": {
        cursor: "pointer",
      },
    },
  },
  fonts: {
    heading: "Nunito Sans, sans-serif",
    body: "Nunito Sans, sans-serif",
  },
  components: {
    Link: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 0,
        boxShadow: "none",
        outline: "none",
      },
      variants: {
        secondary: {
          backgroundColor: "white",
          color: "secondary.600",
          bg: "secondary.200",
          _hover: { fontWeight: "bold" },
          _disabled: {
            color: "secondary.600",
            opacity: 1,
          },
          fontWeight: "normal",
        },
      },
    },
  },
});

export default theme;
