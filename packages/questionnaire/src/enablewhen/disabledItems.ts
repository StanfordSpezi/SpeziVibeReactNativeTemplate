import type { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4';
import { EnableWhenEvaluator } from './EnableWhenEvaluator';

/**
 * Returns the linkIds of every item that is currently hidden by enableWhen, including the items inside a hidden
 * group. Hidden items aren't shown, so they must not be validated or included in the response.
 *
 * FHIR treats a hidden item's answers as absent, so a condition on a hidden question doesn't hold even if the
 * question was answered before it was hidden (Q1 hides Q2, so Q3, which depends on Q2, is hidden too).
 * `buildResponse` builds the response without the given items; this repeats until the set of hidden items stops
 * changing. Conditions such as "!=" can flip back and forth, so it stops after one round per item at most.
 */
export function getDisabledLinkIds(
  questionnaire: Questionnaire,
  buildResponse: (disabledLinkIds: ReadonlySet<string>) => QuestionnaireResponse
): Set<string> {
  const itemCount = countItems(questionnaire.item);
  let disabled = new Set<string>();

  for (let round = 0; round <= itemCount; round++) {
    const next = evaluate(questionnaire, buildResponse(disabled));
    if (next.size === disabled.size && [...next].every((linkId) => disabled.has(linkId))) {
      return next;
    }
    disabled = next;
  }
  return disabled;
}

function evaluate(questionnaire: Questionnaire, questionnaireResponse: QuestionnaireResponse): Set<string> {
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

function countItems(items: QuestionnaireItem[] | undefined): number {
  return (items ?? []).reduce((count, item) => count + 1 + countItems(item.item), 0);
}
