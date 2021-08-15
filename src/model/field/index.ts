import CheckboxField from "./impl/Checkbox";
import InputField from "./impl/Input";


export const IFieldUnion = [
  CheckboxField,
  InputField,
] as const;
