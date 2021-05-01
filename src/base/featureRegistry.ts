import toPairs from '@tinkoff/utils/object/toPairs';
import { StepStructure } from '../types';
import { Feature } from '../features/features.type';

const getName = (name: string) => `feature:${name}`;

export class FeatureRegistry {
  private _featureProviders: Record<string, Feature<unknown>>;

  constructor() {
    this._featureProviders = {};
  }

  fill(a: { structure: StepStructure[]; features: Feature<unknown>[] }) {
    a.features.forEach((cfg) => {
      const key = getName(cfg.name);
      this._featureProviders[key] = {
        service: new cfg.useService(),
      };
    });

    console.log('featureProviders:', this._featureProviders);

    a.structure.forEach((step, index) => {
      toPairs(step).forEach(([fieldName, { controls }]) => {
        if (controls) {
          const getService = (fea: Feature<unknown>) =>
            this._featureProviders[getName(fea.name)].service;

          const fieldControls = controls(getService);
          fieldControls.forEach((element) => {
            element({ initiator: fieldName });
          });
        }
      });
      // if (step.controls) {
      //   console.log(`step: ${index} has controls`);
      // }
    });

    // console.log(a);
  }
}
