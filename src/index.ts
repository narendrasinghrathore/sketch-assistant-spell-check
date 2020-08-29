import {
  AssistantPackage,
  RuleDefinition,
} from '@sketch-hq/sketch-assistant-types';
import data from './data/data.json';
const list = data.list;

/**
 * Get similrar word suggesstion for given word. 
 * @param word The word you searched for
 * @param maxWords Limit number of suggestion
 */
const suggestionList = (word: string, maxWords: number = 5): string[] => {

  const similarWords: string[] = [];
  if (!word) return [];
  console.time('searching');
  list.forEach((item: string, index: number) => {

    const itemFound = item.toLowerCase().indexOf(word);
    if (itemFound >= 0) {
      similarWords.push(list[index]);
    }
  });
  console.timeLog('searching');
  console.timeEnd('searching');
  return similarWords.slice(0, maxWords);
}

const textNoLoremIpsum: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context
    // Iterate
    for (const layer of utils.objects.text) {
      const word = layer.attributedString.string;
      const value = word.toLowerCase();
      // Test
      const misspelled = list.indexOf(value) >= 0 ? false : true;
      const suggestions: string[] = [];
      // Report
      if (misspelled) {
        suggestions.push(...suggestionList(value, 10));
        // Return suggestion(s) for word 
        utils.report(`Layer “${layer.name}” contains incorrect spelling.${suggestions.length > 0 ? ' Did you mean :' + suggestions.join(", ") : ''}`, layer)
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