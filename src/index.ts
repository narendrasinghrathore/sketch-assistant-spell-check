import {
  AssistantPackage,
  RuleDefinition,
} from '@sketch-hq/sketch-assistant-types';
import data from './data/data.json';
const list = data.list;

const specialCharacters = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', "^", "_", '`', '{', '|', '}', '~'];

/**
 * Get similrar word suggesstion for given word. 
 * @param word The word you searched for
 * @param maxWords Limit number of suggestion
 */
const suggestionList = (word: string, maxWords: number = 5): string[] => {

  const similarWords: string[] = [];

  if (!word) return [];

  list.slice(list.indexOf(word.charAt(0))).forEach((item: string, index: number, array) => {

    const itemFound = item.toLowerCase().startsWith(word.toLowerCase());

    if (itemFound) {
      similarWords.push(array[index]);
    }

  });

  return similarWords.slice(0, maxWords);
}

const textNoLoremIpsum: RuleDefinition = {
  rule: async (context) => {

    const { utils } = context

    // Iterate
    for (const layer of utils.objects.text) {

      const words = layer.attributedString.string;
      const values = words
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ").replace(/\n/gi, " ").trim().split(" ");

      values.forEach((word) => {

        /**
         * For example: 
         * #Text/#Sample$ will be
         * ['Text',' ',' ', 'Sample']
         * " ".trim() will return ""
         */
        word = word.trim();

        // Check if we not testing a blank value, if yes return from here.
        if (!word) return;



        // Lowercase the word and check if the string end with "." i.e. and remove if yes
        const transformedWord = word.toLowerCase();

        // Check if not a number
        if (!isNaN(word as any)) return;

        // Check if not a special character
        if (specialCharacters.indexOf(transformedWord) !== -1) return;

        (async () => {
          const misspelled = list.find(w => w.toLowerCase() === transformedWord) !== undefined ? false : true;

          const suggestions: string[] = [];

          // Report
          if (misspelled) {
            suggestions.push(...suggestionList(transformedWord, 10));
            // Return suggestion(s) for word 
            utils.report(`${word}${suggestions.length > 0 ? '. Did you mean : ' + suggestions.join(", ") : ''}`, layer)
          }
        })();



      });

    }
  },
  name: 'sketch-assistant/spell-check',
  title: 'Spelling Error(s)',
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