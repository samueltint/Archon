import { OutlinedInput , type OutlinedInputProps  } from "@mui/material";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeConfig: Record<
  InputSize,
  { height: number; width: string; fontSize: string; padding: string }
> = {
  xs: { height: 20, width: "40px", fontSize: "0.675rem", padding: "2px 0px" },
  sm: { height: 28, width: "40px", fontSize: "0.75rem", padding: "4px 8px" },
  md: { height: 36, width: "80px", fontSize: "0.875rem", padding: "6px 12px" },
  lg: { height: 44, width: "80px", fontSize: "1rem", padding: "8px 14px" },
  xl: { height: 52, width: "80px", fontSize: "1.125rem", padding: "10px 16px" },
};

const InitiativeItemInput = (
  props: Omit<OutlinedInputProps, "size"> & { size?: InputSize },
) => {
  const { size, ...restProps } = props;
  const config = size ? sizeConfig[size] : sizeConfig.sm;

  return (
    <OutlinedInput
      {...restProps}
      sx={{
        ...restProps.sx,
        height: config.height,
        width: config.width,
        fontSize: config.fontSize,
        '& .MuiOutlinedInput-input': {
          padding: config.padding,
        },        

      }}
    />
  );
};

export default InitiativeItemInput;
