import { normalizate } from '../structure.util';

const fakeConf = {
  screen1: {
    type: 'group',
    opts: { fakeOpt: 1 },
    group: {
      field1: { field: 1 },
      field2: { field: 2 },
    },
  },
  screen2: {
    type: 'group',
    opts: { fa: 'foo' },
    group: {
      field3: { field: 3 },
      innerGroup: {
        type: 'group',
        opts: {},
        group: {
          field4: { field: 4 },
        },
      },
    },
  },
};

describe('structure.util', () => {
  describe('normalization', () => {
    it('works ok', () => {
      expect(normalizate(fakeConf)).toEqual({
        groups: {
          'scr.screen1': {
            id: 'scr.screen1',
            children: ['fld.field1', 'fld.field2'],
            opts: { fakeOpt: 1 },
          },
          'grp.innerGroup': {
            id: 'grp.innerGroup',
            children: ['fld.field4'],
            opts: {},
          },
          'scr.screen2': {
            id: 'scr.screen2',
            children: ['fld.field3', 'grp.innerGroup'],
            opts: { fa: 'foo' },
          },
        },
        fields: {
          'fld.field1': { field: 1, id: 'fld.field1' },
          'fld.field2': { field: 2, id: 'fld.field2' },
          'fld.field3': { field: 3, id: 'fld.field3' },
          'fld.field4': { field: 4, id: 'fld.field4' },
        },
        arrays: {},
      });
    });
    it('should fail if duplicate keys found', () => {
      expect(() =>
        normalizate({
          screen1: {
            type: 'group',
            group: {
              dupl: {
                type: 'group',
                group: {
                  field1: { field: 1 },
                },
              },
            },
          },
          screen2: {
            type: 'group',
            group: {
              dupl: {
                type: 'group',
                group: {
                  field1: { field: 1 },
                },
              },
            },
          },
        }),
      ).toThrowError('duplicate key found in groups: grp.dupl');

      expect(() =>
        normalizate({
          screen1: {
            type: 'group',
            group: {
              field1: { field: 1 },
            },
          },
          screen2: {
            type: 'group',
            group: {
              field1: { field: 1 },
            },
          },
        }),
      ).toThrowError('duplicate key found in fields: fld.field1');
    });
  });
});
