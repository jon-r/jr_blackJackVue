export type ButtonControl = {
  id: string;
  label: string;

  icon?: string;
  alert?: string;
  className?: string;
  disabled?: boolean;

  onClick?: () => void;
};
