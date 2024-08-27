export type ButtonControl = {
  id: string;
  label: string;

  icon?: string;
  alert?: string;
  class?: string;
  disabled?: boolean;

  onClick?: () => void;
};
