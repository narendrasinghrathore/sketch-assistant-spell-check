import {
  AssistantPackage,
  RuleDefinition,
} from '@sketch-hq/sketch-assistant-types'

import * as spell from 'simple-spellchecker';

const dictionary = spell.getDictionarySync('en-US');
const textNoLoremIpsum: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    // Iterate
    for (const layer of utils.objects.text) {
      const word = layer.attributedString.string;
      const value = word.toLowerCase();

      // Test
      const { misspelled, suggestions } = dictionary.checkAndSuggest(value);

      // Report
      if (misspelled) {


        // Return suggestion(s) for word 
        utils.report(`Layer “${layer.name}” contains incorrect spelling. Did you mean : ${suggestions.join(", ")}`, layer)
      }
    }
  },
  name: 'sketch-assistant/spell-check',
  title: 'Text should not spelling mistake(s)',
  description:
    'Reports a violation when text layers contain incorrect spelling(s)',
}

const assistant: AssistantPackage = async () => {
  return {
    name: 'sketch-assistant',
    rules: [textNoLoremIpsum],
    config: {
      rules: {
        'sketch-assistant/spell-check': {
          active: true,
        },
      },
    },
  }
}

export default assistant