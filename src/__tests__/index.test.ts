import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'
const fileName = './test.sketch';
// const validateWith = "narendra";
test('spell-check-test', async () => {
  const { violations, ruleErrors } = await testAssistant(
    resolve(__dirname, fileName),
    Assistant,
  )
  console.log(violations)
  const message = violations && violations[0]?.message;
  if (!message) return;
  // expect(message).toMatch(validateWith);
  expect(ruleErrors).toHaveLength(0)
})
