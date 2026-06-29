import { OutlinedInput, type OutlinedInputProps } from "@mui/material";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeConfig: Record<
  InputSize,
  {
    height: number;
    width: string;
    fontSize: string;
    padding: string;
    borderRadius?: number;
  }
> = {
  xs: {
    height: 25,
    width: "25px",
    fontSize: "0.7rem",
    padding: "0px",
    borderRadius: 0.5,
  },
  sm: {
    height: 28,
    width: "40px",
    fontSize: "0.75rem",
    padding: "4px",
    borderRadius: 0.5,
  },
  md: { height: 36, width: "50px", fontSize: "1rem", padding: "6px" },
  lg: { height: 44, width: "80px", fontSize: "1rem", padding: "8px" },
  xl: { height: 52, width: "300px", fontSize: "1.3rem", padding: "10px" },
};

const ControlledInput = (
  props: Omit<OutlinedInputProps, "size"> & {
    size?: InputSize;
    textAlign?: string;
  },
) => {
  const { size, textAlign, ...restProps } = props;
  const config = size ? sizeConfig[size] : sizeConfig.sm;

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
      }}
    />
  );
};

export default ControlledInput;
