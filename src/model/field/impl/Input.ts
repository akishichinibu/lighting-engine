import { PropertySetting } from "@src/model/PropertySetting";
import FieldBase from "./FieldBase";


class InputField extends FieldBase {

  override getPropertiesMetaInfo(): Array<PropertySetting> {
    return [
      {
        name: "minLength",
        dtype: "integer",
        value: null,
      },
      {
        name: "maxLength",
        dtype: "integer",
        value: null,
      },
      {
        name: "defaultValue",
        dtype: "string",
        value: null,
      },
      {
        name: "pattern",
        dtype: "string",
        value: null,
      },
    ];
  }

  override get type(): string {
    return "input";
  }

};


export default InputField;
