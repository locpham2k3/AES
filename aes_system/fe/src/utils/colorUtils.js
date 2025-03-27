import { getContrastRatio } from "@mui/material";

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  // Generate a hash from the string
  for (i = 0; i < string.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  // Generate a hex color code
  for (i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    // Convert to hex and pad with zeros
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
};
// src/utils/colorUtils.js

export const getContrastTextColor = (backgroundColor) => {
  return getContrastRatio(backgroundColor, "#000") >= 4.5 ? "#000" : "#fff";
};
