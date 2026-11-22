import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { FormikProps } from 'formik';

const INTEGER_TEXT = /^-?\d*$/;
const DECIMAL_TEXT = /^-?\d*([.,]\d*)?$/;

/**
 * State for a number text field. The field keeps the text as typed, so partial input such as "1." or "-" isn't
 * reformatted away while the participant types, and stores the parsed number (or undefined) in Formik.
 */
export function useNumberInput(
  formik: FormikProps<Record<string, unknown>>,
  linkId: string,
  { integer, min }: { integer: boolean; min?: number }
) {
  // A minus sign is accepted unless the minimum rules it out. The keyboard only offers one when the question
  // explicitly allows negative numbers: the number pads have no minus key on iOS, but the alternative there is the
  // full symbols keyboard, which is worse for the usual case of positive numbers.
  const allowNegative = min === undefined || min < 0;
  const offerMinusKey = min !== undefined && min < 0;
  const value = formik.values[linkId];
  const [text, setText] = useState(value === undefined || value === null ? '' : String(value));

  // Follow changes made outside this field, e.g. a form reset.
  useEffect(() => {
    const parsed = parse(text, integer);
    if (value !== parsed && !(value === undefined && parsed === undefined)) {
      setText(value === undefined || value === null ? '' : String(value));
    }
    // Only react to the stored value; `text` changes on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onChangeText = (input: string) => {
    if (!(integer ? INTEGER_TEXT : DECIMAL_TEXT).test(input) || (!allowNegative && input.startsWith('-'))) {
      return;
    }
    setText(input);
    formik.setFieldValue(linkId, parse(input, integer));
  };

  let keyboardType: KeyboardTypeOptions = integer ? 'number-pad' : 'decimal-pad';
  if (offerMinusKey) {
    // On Android, 'numeric' is a signed number keyboard; iOS has no signed number pad.
    keyboardType = Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric';
  }

  return { text, onChangeText, keyboardType };
}

/** Parses typed text; incomplete input such as "-" or "." gives undefined. Accepts "," as a decimal separator. */
function parse(text: string, integer: boolean): number | undefined {
  const normalized = text.replace(',', '.');
  if (!/\d/.test(normalized)) {
    return undefined;
  }
  const num = integer ? parseInt(normalized, 10) : parseFloat(normalized);
  return isNaN(num) ? undefined : num;
}
