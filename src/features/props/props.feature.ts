import { globalStore } from '../../base/store';
import { propsChange } from './props.atom';
import toPairs from '@tinkoff/utils/object/toPairs';

class PropsService {
  constructor({ structure }: any) {
    structure.forEach((step, index) => {
      toPairs(step).forEach(([fieldName, { props }]) => {
        // @TODO выпилить костыль после создания атомов внутри фичей
        setTimeout(() => {
          globalStore.dispatch(propsChange({ name: fieldName, value: props }));
        });
      });
      // if (step.controls) {
      //   console.log(`step: ${index} has controls`);
      // }
    });
  }
}

export const PropsFeature = {
  name: 'props',
  useService: PropsService,
};
