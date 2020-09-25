import {
  AssistantPackage,
  RuleDefinition,
} from '@sketch-hq/sketch-assistant-types';
import data from './data/data.json';
const p = require('../package.json');
/**
 * ### Data source of words [en-US]
 *  List of all the words  against which we compare the given 
 * word from sketch file and check if it is spelled correctly.
 */
const list = data.list;
const listLowerCase = data.list.map(item => item.toLowerCase());

const specialCharacters = ['!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', "^", "_", '`', '{', '|', '}', '~'];

/**
 * Get similrar word suggesstion for given word. 
 * @param word The word you searched for
 * @param maxWords Limit number of suggestion
 */
const suggestionList = (word: string, maxWords: number = 5): string[] => {

  const similarWords: string[] = [];

  if (!word) return [];

  // Get start index with startsWith and get only maxWords items from our array of words for suggestion.
  const indexStartSliceFrom = list.findIndex(item => item.startsWith(word));

  if (indexStartSliceFrom === -1) return [];

  const indexStartSliceTo = indexStartSliceFrom + maxWords;

  const wordsSuggesstionList = list.slice(indexStartSliceFrom, indexStartSliceTo);

  if (wordsSuggesstionList.length === 0) return [];

  for (let i = 0; i < maxWords; i++) {
    similarWords.push(wordsSuggesstionList[i]);
  }

  return similarWords;

};

const spellChecker: RuleDefinition = {
  rule: async (context) => {

    const { utils } = context;

    // source data from files
    const text = utils.objects.text;

    // Iterate
    for (const layer of text) {

      const words = layer.attributedString.string;
      const values = words
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ")
        .replace(/\n/gi, " ")
        .trim()
        .split(" ");
      const valuesLowerCase = values.map(item => item && item.toLowerCase());

      valuesLowerCase.forEach((word, index) => {
        /**
         * For example: 
         * #Text/#Sample$ will be
         * ['Text',' ',' ', 'Sample']
         * " ".trim() will return ""
         */
        word = word.trim();

        // Check if we not testing a blank value, if yes return from here.
        if (!word) return;

        // Check if not a number
        if (!isNaN(word as any)) return;

        // Check if not a special character
        if (specialCharacters.indexOf(word) !== -1) return;

        (async () => {
          const misspelled = listLowerCase.find(w => w === word) !== undefined ? false : true;

          const suggestions: string[] = [];

          // Report
          if (misspelled) {
            suggestions.push(...suggestionList(word, 10));
            // Return suggestion(s) for word 
            utils.report(`${values[index]}${suggestions.length > 0 ? '. Did you mean : ' + suggestions.join(", ") : ''}`, layer)
          }
        })();

      });

    }
  },
  name: p.name,
  title: 'Use correct spellings.',
  description:
    'Use correct spelling in your text layer(s)',
}

const assistant: AssistantPackage = async () => {
  return {
    name: p.name,
    rules: [spellChecker],
    config: {
      rules: {
        [p.name]: {
          active: true,
        },
      },
    },
  }
}

export default assistant