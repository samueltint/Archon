import {
  TextField,
  type TextFieldProps,
  styled,
} from "@mui/material";
import { forwardRef } from "react";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomInputProps extends Omit<TextFieldProps, "size"> {
  size?: InputSize;
  expand?: boolean;
  fontWeight?: string;
}

const sizeConfig: Record<InputSize, { height: number; width: string; fontSize: string; padding: string }> = {
  xs: { height: 20, width: "40px", fontSize: "0.675rem", padding: "2px 6px" },
  sm: { height: 28, width: "40px", fontSize: "0.75rem", padding: "4px 8px" },
  md: { height: 36, width: "40px", fontSize: "0.875rem", padding: "6px 12px" },
  lg: { height: 44, width: "40px", fontSize: "1rem", padding: "8px 14px" },
  xl: { height: 52, width: "40px", fontSize: "1.125rem", padding: "10px 16px" },
};

const StyledTextField = styled(TextField)<{ customSize: InputSize; expand: boolean, fontWeight: string }>(
  ({ customSize, expand, fontWeight }) => {
    const config = sizeConfig[customSize];
    return {
      "& .MuiOutlinedInput-root": {
        height: config.height,
        fontSize: config.fontSize,
        width: expand ? "100%" : config.width,
        padding: 0,
        "& input": {
          padding: config.padding,
          height: "100%",
          boxSizing: "border-box",
          fontWeight: fontWeight,
        },
      },
      "& .MuiOutlinedInput-input": {
        padding: config.padding,
        fontWeight: "inherit",
      },
    };
  }
);

export const Input = forwardRef<HTMLDivElement, CustomInputProps>(
  ({ size = "md", variant = "outlined", expand = false, fontWeight = "normal", ...props }, ref) => {
    return (

      <StyledTextField
        ref={ref}
        customSize={size}
        expand={expand}
        fontWeight={fontWeight}
        variant={variant}
        {...props}
        />
    );
  }
);

Input.displayName = "Input";
