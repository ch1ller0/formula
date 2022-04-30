import { declareContainer, injectable, TokenProvide } from '@fridgefm/inverter';
import { CoreModule } from '../index';
import { STRUCTURE_CONFIG_TOKEN, STRUCTURE_STORE_TOKEN } from '../tokens';

const createFakeDependencies = () => {
  const mocks = {
    fieldMock: () => 'noop',
    arrayGeneratorMock: (index) => ({
      array_item: { field: mocks.fieldMock, props: { index } },
    }),
  };
  const deps: {
    structureConfigFactory: () => TokenProvide<typeof STRUCTURE_CONFIG_TOKEN>;
  } = {
    structureConfigFactory: jest.fn(() => ({ array, group }) => ({
      // first step
      0: group({
        caption: { field: mocks.fieldMock },
        array: array(mocks.arrayGeneratorMock, { count: 2 }),
      }),
      1: group({ finish: { field: mocks.fieldMock } }),
    })),
  };

  return {
    container: declareContainer({
      modules: [CoreModule],
      providers: [
        injectable({
          provide: STRUCTURE_CONFIG_TOKEN,
          useFactory: deps.structureConfigFactory,
        }),
      ],
    }),
    deps,
    mocks,
  };
};

describe('structure.provider', () => {
  describe('structure.store', () => {
    it('initialState', () => {
      const { container, mocks } = createFakeDependencies();
      const store = container.get(STRUCTURE_STORE_TOKEN);
      const { fields, arrays, groups } = store.getState();

      expect(fields).toEqual({
        'fld.caption': { field: mocks.fieldMock, id: 'fld.caption', path: ['scr.0'] },
        'fld.array_item[0]': {
          field: mocks.fieldMock,
          props: { index: 0 },
          id: 'fld.array_item[0]',
          path: ['scr.0', 'arr.array'],
        },
        'fld.array_item[1]': {
          field: mocks.fieldMock,
          props: { index: 1 },
          id: 'fld.array_item[1]',
          path: ['scr.0', 'arr.array'],
        },
        'fld.finish': { field: mocks.fieldMock, id: 'fld.finish', path: ['scr.1'] },
      });
      expect(groups).toEqual({
        'scr.0': { id: 'scr.0', children: ['fld.caption', 'arr.array'], opts: {} },
        'scr.1': { id: 'scr.1', children: ['fld.finish'], opts: {} },
      });
      expect(arrays).toEqual({
        'arr.array': {
          id: 'arr.array',
          children: ['fld.array_item[0]', 'fld.array_item[1]'],
          opts: { count: 2 },
          generator: mocks.arrayGeneratorMock,
        },
      });
    });
  });
});
