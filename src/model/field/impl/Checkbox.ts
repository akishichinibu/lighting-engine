import { PropertySetting } from "@src/model/PropertySetting";
import FieldBase from "./FieldBase";


class CheckboxField extends FieldBase {

  override getPropertiesMetaInfo(): Array<PropertySetting> {
    return [
      {
        name: "defaultValue",
        dtype: "boolean",
        value: "false",
      },
    ];
  }

  override get type(): string {
    return "checkbox";
  }

};


export default CheckboxField;
