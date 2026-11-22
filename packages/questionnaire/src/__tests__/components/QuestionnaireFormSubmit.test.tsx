import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import type { Questionnaire, QuestionnaireResponse } from 'fhir/r4';
import { QuestionnaireForm } from '../../components/QuestionnaireForm';

// Submits a questionnaire whose answers come from `initialResponse`, and returns what onResult received.
async function submit(questionnaire: Questionnaire, answers: QuestionnaireResponse['item'] = []) {
  const onResult = jest.fn();
  const screen = render(
    <QuestionnaireForm
      questionnaire={questionnaire}
      onResult={onResult}
      initialResponse={{ resourceType: 'QuestionnaireResponse', status: 'in-progress', item: answers }}
    />
  );
  fireEvent.press(screen.getByText('Submit'));
  await waitFor(() => expect(onResult).toHaveBeenCalled());
  return { result: onResult.mock.calls[0][0], screen };
}

// Presses Submit and checks that nothing is submitted.
async function expectBlocked(questionnaire: Questionnaire, answers: QuestionnaireResponse['item'] = []) {
  const onResult = jest.fn();
  const screen = render(
    <QuestionnaireForm
      questionnaire={questionnaire}
      onResult={onResult}
      initialResponse={{ resourceType: 'QuestionnaireResponse', status: 'in-progress', item: answers }}
    />
  );
  fireEvent.press(screen.getByText('Submit'));
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(onResult).not.toHaveBeenCalled();
  return screen;
}

const MAX = (valueInteger: number) => ({ url: 'http://hl7.org/fhir/StructureDefinition/maxValue', valueInteger });
const q = (...item: Questionnaire['item'] & object): Questionnaire => ({ resourceType: 'Questionnaire', status: 'active', item });

describe('QuestionnaireForm submission', () => {
  describe('hidden questions', () => {
    const gated = q(
      { linkId: 'smoker', type: 'boolean', text: 'Do you smoke?' },
      {
        linkId: 'packs',
        type: 'integer',
        text: 'Packs per day',
        required: true,
        enableWhen: [{ question: 'smoker', operator: '=', answerBoolean: true }],
      }
    );

    it('does not block Submit on a required question that is hidden', async () => {
      const { result } = await submit(gated, [{ linkId: 'smoker', answer: [{ valueBoolean: false }] }]);
      expect(result.status).toBe('completed');
    });

    it('still requires the question when it is shown', async () => {
      await expectBlocked(gated, [{ linkId: 'smoker', answer: [{ valueBoolean: true }] }]);
    });

    it('leaves answers to hidden questions out of the response', async () => {
      const { result } = await submit(gated, [
        { linkId: 'smoker', answer: [{ valueBoolean: false }] },
        { linkId: 'packs', answer: [{ valueInteger: 2 }] },
      ]);
      expect(result.response.item.map((i: { linkId: string }) => i.linkId)).toEqual(['smoker']);
    });

    it('treats answers to hidden questions as absent, so questions depending on them are hidden too', async () => {
      const chain = q(
        { linkId: 'q1', type: 'boolean', text: 'Q1' },
        { linkId: 'q2', type: 'boolean', text: 'Q2', enableWhen: [{ question: 'q1', operator: '=', answerBoolean: true }] },
        {
          linkId: 'q3',
          type: 'string',
          text: 'Q3',
          required: true,
          enableWhen: [{ question: 'q2', operator: '=', answerBoolean: true }],
        }
      );
      // Q2 was answered before Q1 changed and hid it, so its stale answer must not keep Q3 shown (and required).
      const { result, screen } = await submit(chain, [
        { linkId: 'q1', answer: [{ valueBoolean: false }] },
        { linkId: 'q2', answer: [{ valueBoolean: true }] },
        { linkId: 'q3', answer: [{ valueString: 'stale' }] },
      ]);
      expect(result.status).toBe('completed');
      expect(result.response.item.map((i: { linkId: string }) => i.linkId)).toEqual(['q1']);
      expect(screen.queryByText('Q3')).toBeNull();
    });

    it('treats questions in a hidden group as hidden', async () => {
      const questionnaire = q(
        { linkId: 'smoker', type: 'boolean', text: 'Do you smoke?' },
        {
          linkId: 'details',
          type: 'group',
          text: 'Details',
          enableWhen: [{ question: 'smoker', operator: '=', answerBoolean: true }],
          item: [{ linkId: 'since', type: 'integer', text: 'Since when?', required: true }],
        }
      );
      const { result } = await submit(questionnaire, [{ linkId: 'smoker', answer: [{ valueBoolean: false }] }]);
      expect(result.status).toBe('completed');
    });
  });

  it('does not block Submit on required questions the form cannot show', async () => {
    const { result } = await submit(
      q(
        { linkId: 'photo', type: 'attachment', text: 'Photo', required: true },
        { linkId: 'vs', type: 'choice', text: 'From a value set', required: true, answerValueSet: '#vs' },
        { linkId: 'parent', type: 'string', text: 'Parent', item: [{ linkId: 'child', type: 'string', text: 'Child', required: true }] },
        {
          linkId: 'parent2',
          type: 'boolean',
          text: 'Parent 2',
          item: [{ linkId: 'nested', type: 'group', item: [{ linkId: 'deep', type: 'string', text: 'Deep', required: true }] }],
        }
      )
    );
    expect(result.status).toBe('completed');
  });

  it('enforces limits on optional questions', async () => {
    const questionnaire = q({ linkId: 'hours', type: 'integer', text: 'Hours of sleep', extension: [MAX(24)] });
    const screen = await expectBlocked(questionnaire, [{ linkId: 'hours', answer: [{ valueInteger: 99 }] }]);
    expect(screen.getByText('Must be at most 24')).toBeTruthy();

    const { result } = await submit(questionnaire);
    expect(result.status).toBe('completed');
  });

  it.each([
    ['valueString', { valueString: 'Often' }],
    ['valueInteger', { valueInteger: 3 }],
    ['valueCoding', { valueCoding: { system: 'http://example.org', code: 'often', display: 'Often' } }],
  ])('keeps a %s choice answer in the response', async (_name, option) => {
    const questionnaire = q({ linkId: 'freq', type: 'choice', text: 'How often?', answerOption: [option] });
    const { result } = await submit(questionnaire, [{ linkId: 'freq', answer: [option] }]);
    expect(result.response.item[0].answer).toEqual([option]);
  });

  it('saves time answers in FHIR format and checks their format', async () => {
    const questionnaire = q({ linkId: 'bed', type: 'time', text: 'Bedtime' });
    const { result } = await submit(questionnaire, [{ linkId: 'bed', answer: [{ valueTime: '22:30:00' }] }]);
    expect(result.response.item[0].answer).toEqual([{ valueTime: '22:30:00' }]);

    const screen = await expectBlocked(questionnaire, [{ linkId: 'bed', answer: [{ valueTime: '99:99' }] }]);
    expect(screen.getByText('Enter a time as HH:MM, for example 14:30')).toBeTruthy();
  });

  it('keeps the day of a date answer', async () => {
    const questionnaire = q({ linkId: 'start', type: 'date', text: 'Start date' });
    const { result } = await submit(questionnaire, [{ linkId: 'start', answer: [{ valueDate: '2026-03-15' }] }]);
    expect(result.response.item[0].answer).toEqual([{ valueDate: '2026-03-15' }]);
  });
});
