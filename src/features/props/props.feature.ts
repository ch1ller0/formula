import { globalStore } from '../../base/store';
import { propsChange } from './props.atom';
import toPairs from '@tinkoff/utils/object/toPairs';

import type { Props } from './props.atom';
import type { FeatureConfig } from '../features.type';

class PropsService {
  constructor({ structure, deps }: any) {
    structure.forEach((step, index) => {
      toPairs(step).forEach(([fieldName, { props }]) => {
        // @TODO выпилить костыль после создания атомов внутри фичей
        setTimeout(() => {
          globalStore.dispatch(propsChange({ name: fieldName, value: props }));
        });
      });
    });
  }

  setFieldProp({ name, value }: { name: string; value: Props }) {
    setTimeout(() => {
      globalStore.dispatch(propsChange({ name, value }));
    }, 10);
  }
}

export const PropsFeature: FeatureConfig<unknown> = {
  name: 'props',
  useService: PropsService,
};
