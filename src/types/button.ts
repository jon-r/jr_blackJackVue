export type ButtonControl = {
  canUse: boolean;
  label: string; // todo rename to label?

  icon?: string;
  alert?: string;
  className?: string;
  svg?: string;

  onClick?: () => void;
};
