import { OutlinedInput, useTheme, type OutlinedInputProps } from "@mui/material";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeConfig: Record<
  InputSize,
  {
    height: string;
    width: string;
    fontSize: string;
    padding: string;
    borderRadius?: number;
  }
> = {
  xs: {
    height: "25px",
    width: "25px",
    fontSize: "0.7rem",
    padding: "0px",
    borderRadius: 0.5,
  },
  sm: {
    height: "25px",
    width: "40px",
    fontSize: "0.75rem",
    padding: "4px",
    borderRadius: 0.5,
  },
  md: {
    height: "36px",
    width: "50px",
    fontSize: "1rem",
    padding: "6px",
    borderRadius: 0.5,
  },
  lg: {
    height: "44px",
    width: "80px",
    fontSize: "1rem",
    padding: "8px",
    borderRadius: 0.5,
  },
  xl: {
    height: "52px",
    width: "full",
    fontSize: "1.3rem",
    padding: "10px",
    borderRadius: 0.5,
  },
};

const ControlledInput = (
  props: Omit<OutlinedInputProps, "size"> & {
    size?: InputSize;
    textAlign?: string;
  },
) => {
  const { size, textAlign, ...restProps } = props;
  const config = size ? sizeConfig[size] : sizeConfig.sm;
  const theme = useTheme()
  return (
    <OutlinedInput
      {...restProps}
      sx={{
        ...restProps.sx,
        height: config.height,
        width: config.width,
        fontSize: config.fontSize,
        borderRadius: config.borderRadius ?? 1,
        "& .MuiOutlinedInput-input": {
          padding: config.padding,
          textAlign: textAlign ?? "center",
        },
        "& .MuiOutlinedInput-input.Mui-disabled": {
          color: theme.palette.primary.contrastText,
          WebkitTextFillColor: theme.palette.text.primary,
        },
      }}
    />
  );
};
export default ControlledInput;
