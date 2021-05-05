import { useState } from './step.atom';
import { PropsFeature } from '../props/props.feature';
import type { FeatureConfig } from '../features.type';

export const StepFeature: FeatureConfig<unknown> = {
  name: 'step',
  useState,
  useService: class StepService implements FeatureService {
    constructor({ deps }) {
      // this._propsService = getService(PropsFeature);
    }

    getCurrentStep() {
      return 0;
    }

    bindNextStep() {
      return ({ initiator }) => {
        // this._propsService.setFieldProp({
        //   name: initiator.fieldName,
        //   value: {
        //     onAction: () => globalStore.dispatch(stepIncrement()),
        //   },
        // });
      };
    }
  },
  deps: [PropsFeature],
};
