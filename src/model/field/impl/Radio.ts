import { PropertySetting } from "@model/PropertySetting";
import FieldBase from "./FieldBase";


class RadioField extends FieldBase {

  override getPropertiesMetaInfo(): Array<PropertySetting> {
    return [
      {
        name: "input",
        dtype: "schema",
        value: null,
      },
      {
        name: "defaultValue",
        dtype: "string",
        value: null,
      },
    ];
  }

  override get type(): string {
    return "checkbox";
  }

};


export default RadioField;
