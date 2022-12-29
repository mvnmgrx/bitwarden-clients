export type InputTypes =
  | "text"
  | "password"
  | "number"
  | "datetime-local"
  | "email"
  | "checkbox"
  | "search";

export abstract class BitFormFieldControl {
  ariaDescribedBy: string;
  id: string;
  labelForId: string;
  required: boolean;
  hasError: boolean;
  error: [string, any];
  type?: InputTypes;
  spellcheck?: boolean;
  focus?: () => void;
}
