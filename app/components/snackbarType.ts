import React from "react";

export type SnackbarType = {
  key: string; // snackbar identifier
  text: React.ReactNode;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  variant: "success" | "error" | "warning" | "info"; // snackbar variant
};

type Success = "bg-green-500";
type Error = "bg-red-500";
type Warning = "bg-yellow-500";
type Info = "bg-blue-500";

type Variant = Success | Error | Warning | Info;

export type TSnackbarProps = Omit<SnackbarType, "key"> & {
  handleClose: () => void;
  // open: boolean;
  className?: string;
  // variant: Variant;
};
