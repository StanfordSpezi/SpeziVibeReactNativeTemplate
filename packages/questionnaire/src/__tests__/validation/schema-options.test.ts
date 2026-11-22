import type { QuestionnaireItem } from 'fhir/r4';
import { createValidationSchema } from '../../validation/schema-builder';

const items: QuestionnaireItem[] = [
  { linkId: 'photo', type: 'attachment', text: 'Photo', required: true },
  { linkId: 'hours', type: 'integer', text: 'Hours', extension: [{ url: 'http://hl7.org/fhir/StructureDefinition/maxValue', valueInteger: 24 }] },
  { linkId: 'gated', type: 'string', text: 'Gated', required: true },
];

const errors = (schema: ReturnType<typeof createValidationSchema>, values: Record<string, unknown>) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return [];
  } catch (error: any) {
    return error.inner.map((e: { path: string }) => e.path).sort();
  }
};

describe('createValidationSchema options', () => {
  it('keeps checking required items of any type by default, for apps with their own renderers', () => {
    expect(errors(createValidationSchema(items), { gated: 'x' })).toEqual(['photo']);
  });

  it('only checks items QuestionnaireForm can show with onlyRendered', () => {
    expect(errors(createValidationSchema(items, { onlyRendered: true }), { gated: 'x' })).toEqual([]);
  });

  it('skips disabled items', () => {
    expect(errors(createValidationSchema(items, { disabledLinkIds: new Set(['gated', 'photo']) }), {})).toEqual([]);
  });

  it('checks limits on optional questions', () => {
    expect(errors(createValidationSchema(items, { onlyRendered: true }), { gated: 'x', hours: 99 })).toEqual(['hours']);
  });
});
