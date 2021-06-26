// const group = (a) => a;
// const array = (a) => a;

import type { TFieldStructure } from '../../../types/base.types';

// export const fakeStructure2 = {
//   step0: group({
//     email: 'email_field',
//     home_phone: group({
//       area: 'area_field',
//       prefix: 'prefix_field',
//       line: 'line_field',
//     }),
//     cell_phone: group({
//       area: 'area_field',
//       prefix: 'prefix_field',
//       line: 'line_field',
//     }),
//   }),
//   step1: group({
//     email: 'email_field',
//     phones: array({
//       area: 'area_field',
//       prefix: 'prefix_field',
//       line: 'line_field',
//     }),
//     // button to add new phone - CONTROLS STRUCTURE
//     add_phone: 'button',
//   }),
//   step2: group({
//     card_setup: group({
//       card_setup_title: 'text',
//       desired_credit_limit: 'slider',
//       card_want_reason: 'selectPicker',
//     }),
//     contact_info: group({
//       fio_title: 'text',
//       fio: 'inputSuggest',
//       phone_mobile: 'input',
//       email: 'input',
//     }),
//   }),
//   step3: group({
//     card_setup_credit: group({
//       desired_credit_limit: 'slider',
//       card_want_reason: 'selectPicker',
//     }),
//     card_setup_debit: group({
//       desired_credit_limit: 'slider',
//       card_want_reason: 'selectPicker',
//     }),
//     // button to change selected group - CONTROLS STRUCTURE
//     change_debit_credit: 'button',
//   }),
// };

// Screens = step0, step1, step2
type ScreenName = string;

export type StructureInput = Group | Array | TFieldStructure;

export type Array = { array: StructureInput[] };
export type Group = { group: Record<string, StructureInput> };
export type FormStructure = Record<ScreenName, StructureInput>;
type Args = {
  group(cfg: Record<string, StructureInput>): Group;
  array(cfg: Record<string, StructureInput>): Array;
};
export type StructureFactory = (args: Args) => FormStructure;
