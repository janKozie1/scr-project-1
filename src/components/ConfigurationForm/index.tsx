import { useRef, useEffect } from 'react';

import { GenerateRandomTaskConfig, Literal } from "../../services/types"
import { isNil, isNumber } from '../../services/utils';
import Box from "../Box";
import Button from '../Button';
import Columns from "../Columns";
import Label from "../Label";
import Rows from "../Rows";

const formFields = {
  amount: 'amount',
  availability_min: 'r_min',
  availability_max: 'r_max',
  completion_min: 'p_min',
  completion_max: 'p_max',
  deadline_min: 'd_min',
  deadline_max: 'd_max',
}

type FlattenedConfig = Record<keyof typeof formFields, number>

const flattenConfig = (config: Configuration): FlattenedConfig => Object.fromEntries(
  Object.entries(config).flatMap(([key, value]) => isNumber(value)
    ? [[key, value]]
    : Object.entries(value).map(([subKey, subValue]) => [`${key}_${subKey}`, subValue]))
) as FlattenedConfig;

const setFormValues = (config: FlattenedConfig, ref: HTMLFormElement) => {
  const formFieldsValues = Object.entries(config).map(([configKey, value]) => [formFields[configKey as keyof FlattenedConfig], value]);

  formFieldsValues.forEach(([name, value]) => {
    const input = ref.querySelector(`input[name="${name}"]`);

    if (input) {
      (input as HTMLInputElement).value = `${value}`;
    }
  })
}

const getFormValues = (ref: HTMLFormElement): FlattenedConfig => {
  const reverseFieldMapping = Object.fromEntries(Object.entries(formFields).map(([key, value]) => [value, key]));

  return Object.fromEntries([...ref.querySelectorAll('input')]
    .map((input) => [reverseFieldMapping[input.name], Number(input.value)])) as FlattenedConfig;
}

const unflattenConfig = (config: FlattenedConfig): Configuration => {
  return Object.entries(config).reduce<Configuration>((config, [key, value]) => {
    if (key.includes('_')) {
      const [topKey, subKey] = key.split('_');

      return ({
        ...config,
        [topKey]: {
          ...((config as Literal)[topKey] as Literal),
          [subKey]: value,
        }
      })
    }

    return {
      ...config,
      [key]: value,
    }

  }, {} as Configuration)
}

export type Configuration = GenerateRandomTaskConfig & Readonly<{
  amount: number;
}>

type Props = Readonly<{
  configuration: Configuration;
  onSubmit: (newConfig: Configuration) => void;
}>

const ConfigurationForm = ({configuration, onSubmit}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const onInternalSubmit = () => {
    const form = formRef.current;

    if (!isNil(form)) {
      onSubmit(unflattenConfig(getFormValues(form)))
    }
  }

  useEffect(() => {
    const form = formRef.current;

    if (isNil(form)) {
      return;
    }

    setFormValues(flattenConfig(configuration), form);
  }, [configuration])

  return (
    <form ref={formRef} onSubmit={(e) => {
      e.preventDefault()
      onInternalSubmit()
    }}>
      <Box>
        <Rows gap={10}>
          <Label>
            Amount
            <input name="amount" type="number" min="1" />
          </Label>
          <Columns gap={10}>
            <Label>
              P (min)
              <input name="p_min" type="number" min="1" />
            </Label>
            <Label>
              P (max)
              <input name="p_max" type="number" min="1" />
            </Label>
          </Columns>
          <Columns gap={10}>
            <Label>
              R (min)
              <input name="r_min" type="number" min="1" />
            </Label>
            <Label>
              R (max)
              <input name="r_max" type="number" min="1" />
            </Label>
          </Columns>
          <Columns gap={10}>
            <Label>
              D (min)
              <input name="d_min" type="number" min="1" />
            </Label>
            <Label>
              D (max)
              <input name="d_max" type="number" min="1" />
            </Label>
          </Columns>
        </Rows>
        <Box mt={10} fullWidth justifyContent="center">
          <Button type="submit">Save</Button>
        </Box>
      </Box>
    </form>
  )
}

export default ConfigurationForm;
