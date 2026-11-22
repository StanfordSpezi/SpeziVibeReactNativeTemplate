import * as Yup from 'yup';
import type { QuestionnaireItem } from 'fhir/r4';

/** Item types that QuestionRenderer renders; anything else isn't shown, so it can't be validated. */
const RENDERED_TYPES = ['boolean', 'string', 'text', 'integer', 'decimal', 'date', 'dateTime', 'time', 'choice', 'open-choice'];

/** HH:MM, 24-hour. */
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Creates a Yup validation schema from FHIR Questionnaire items.
 *
 * Every question the form shows is validated: required questions must be answered, and min/max, whole numbers,
 * maxLength and time format are checked whenever a question has an answer. Questions the form doesn't show are
 * skipped, so they can't block submission: items in `disabledLinkIds` (hidden by enableWhen, see
 * getDisabledLinkIds), unsupported types, choices without answerOption, and items nested under a question.
 */
export function createValidationSchema(
  items: QuestionnaireItem[],
  disabledLinkIds: ReadonlySet<string> = new Set()
): Yup.ObjectSchema<any> {
  const schema: Record<string, any> = {};

  const processItem = (item: QuestionnaireItem, underQuestion: boolean) => {
    if (item.linkId && disabledLinkIds.has(item.linkId)) {
      return;
    }
    if (item.type === 'display') {
      return;
    }
    if (item.type === 'group') {
      item.item?.forEach((child) => processItem(child, false));
      return;
    }

    // Only groups render their children, so items nested under a question are never shown.
    const isShown =
      !underQuestion &&
      RENDERED_TYPES.includes(item.type) &&
      !((item.type === 'choice' || item.type === 'open-choice') && !item.answerOption?.length);
    if (isShown && item.linkId) {
      schema[item.linkId] = createValidationForItem(item);
    }

    item.item?.forEach((child) => processItem(child, true));
  };

  items.forEach((item) => processItem(item, false));

  return Yup.object().shape(schema);
}

/**
 * Creates a Yup validator for a single FHIR questionnaire item
 */
function createValidationForItem(item: QuestionnaireItem): Yup.Schema {
  const required = !!item.required;

  switch (item.type) {
    case 'boolean': {
      const schema = Yup.boolean();
      return required ? schema.required('Please make a selection') : schema;
    }

    case 'string':
    case 'text':
      return createStringValidation(item, required);

    case 'integer':
      return createNumberValidation(item, required, true);

    case 'decimal':
      return createNumberValidation(item, required, false);

    case 'date':
    case 'dateTime': {
      const schema = Yup.date();
      return required ? schema.required('This field is required') : schema;
    }

    case 'time': {
      const schema = Yup.string().matches(TIME_PATTERN, 'Enter a time as HH:MM, for example 14:30');
      return required ? schema.required('This field is required') : schema;
    }

    case 'choice':
    case 'open-choice': {
      const schema = Yup.mixed();
      return required ? schema.required('Please select an option') : schema;
    }

    default: {
      const schema = Yup.mixed();
      return required ? schema.required('This field is required') : schema;
    }
  }
}

/**
 * Create string validation with maxLength support
 */
function createStringValidation(item: QuestionnaireItem, required: boolean): Yup.StringSchema {
  let schema = Yup.string();

  if (item.maxLength) {
    schema = schema.max(item.maxLength, `Maximum length is ${item.maxLength} characters`);
  }

  return required ? schema.required('This field is required') : schema;
}

/**
 * Create number validation with min/max from extensions
 */
function createNumberValidation(item: QuestionnaireItem, required: boolean, integer: boolean): Yup.NumberSchema {
  let schema = Yup.number().typeError('Enter a number');

  if (integer) {
    schema = schema.integer('Must be a whole number');
  }

  const { min, max } = getMinMaxFromExtensions(item);

  if (min !== undefined) {
    schema = schema.min(min, `Must be at least ${min}`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `Must be at most ${max}`);
  }

  return required ? schema.required('This field is required') : schema;
}

/**
 * Extract min and max values from FHIR extensions
 */
function getMinMaxFromExtensions(item: QuestionnaireItem): { min?: number; max?: number } {
  if (!item.extension) {
    return {};
  }

  let min: number | undefined;
  let max: number | undefined;

  for (const ext of item.extension) {
    if (ext.url === 'http://hl7.org/fhir/StructureDefinition/minValue') {
      min = ext.valueInteger ?? ext.valueDecimal;
    }
    if (ext.url === 'http://hl7.org/fhir/StructureDefinition/maxValue') {
      max = ext.valueInteger ?? ext.valueDecimal;
    }
  }

  return { min, max };
}
