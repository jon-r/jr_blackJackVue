export type ButtonControl = {
  id: string;
  // canUse: boolean;
  label: string;

  icon?: string;
  alert?: string;
  class?: string;
  disabled?: boolean;

  onClick?: () => void;
};
