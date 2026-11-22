import type { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4';
import { EnableWhenEvaluator } from './EnableWhenEvaluator';

/**
 * Returns the linkIds of every item that is currently hidden by enableWhen, including the items inside a hidden
 * group. Hidden items aren't shown, so they must not be validated or included in the response.
 */
export function getDisabledLinkIds(
  questionnaire: Questionnaire,
  questionnaireResponse: QuestionnaireResponse
): Set<string> {
  const evaluator = new EnableWhenEvaluator(questionnaire, questionnaireResponse);
  const disabled = new Set<string>();

  const visit = (items: QuestionnaireItem[] | undefined, parentDisabled: boolean) => {
    for (const item of items ?? []) {
      const isDisabled = parentDisabled || !evaluator.evaluate(item);
      if (isDisabled && item.linkId) {
        disabled.add(item.linkId);
      }
      visit(item.item, isDisabled);
    }
  };

  visit(questionnaire.item, false);
  return disabled;
}
