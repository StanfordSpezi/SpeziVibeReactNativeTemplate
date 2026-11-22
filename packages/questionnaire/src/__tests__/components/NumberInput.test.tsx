import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Formik, FormikProps } from 'formik';
import type { QuestionnaireItem } from 'fhir/r4';
import { DecimalQuestion } from '../../components/questions/DecimalQuestion';
import { IntegerQuestion } from '../../components/questions/IntegerQuestion';
import { defaultLightTheme } from '../../theme/default-theme';

// Typing into a number field one keystroke at a time, as a participant does.
function renderField(Component: typeof DecimalQuestion | typeof IntegerQuestion, item: QuestionnaireItem) {
  let formik: FormikProps<Record<string, unknown>> | undefined;
  const screen = render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      {(f) => {
        formik = f;
        return <Component item={item} formik={f} theme={defaultLightTheme} />;
      }}
    </Formik>
  );
  // Each key is appended to what the field shows, so a rejected key is simply lost, as on a real keyboard.
  const type = (keys: string) => {
    for (const key of keys) {
      const input = screen.getByLabelText(item.text!);
      fireEvent.changeText(input, `${input.props.value}${key}`);
    }
  };
  return { input: () => screen.getByLabelText(item.text!), type, value: () => formik!.values[item.linkId] };
}

describe('number fields', () => {
  it('accept a decimal point while typing', () => {
    const field = renderField(DecimalQuestion, { linkId: 'w', type: 'decimal', text: 'Weight' });
    field.type('72.5');
    expect(field.input().props.value).toBe('72.5');
    expect(field.value()).toBe(72.5);
  });

  it('accept a comma as the decimal separator', () => {
    const field = renderField(DecimalQuestion, { linkId: 'w', type: 'decimal', text: 'Weight' });
    field.type('0,5');
    expect(field.value()).toBe(0.5);
  });

  it('accept a minus sign when negative values are allowed', () => {
    const field = renderField(IntegerQuestion, { linkId: 't', type: 'integer', text: 'Temperature' });
    field.type('-3');
    expect(field.input().props.value).toBe('-3');
    expect(field.value()).toBe(-3);
  });

  it('ignore a minus sign when the minimum is not negative', () => {
    const field = renderField(IntegerQuestion, {
      linkId: 'n',
      type: 'integer',
      text: 'Steps',
      extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/minValue', valueInteger: 0 }],
    });
    field.type('-5');
    expect(field.value()).toBe(5);
  });

  it('ignore letters and store nothing for incomplete input', () => {
    const field = renderField(DecimalQuestion, { linkId: 'w', type: 'decimal', text: 'Weight' });
    field.type('a-');
    expect(field.input().props.value).toBe('-');
    expect(field.value()).toBeUndefined();
  });
});
