import toPairs from '@tinkoff/utils/object/toPairs';
import { StepStructure } from '../types';
import { Feature } from '../features/features.type';

const getName = (name: string) => `feature:${name}`;

export class FeatureRegistry {
  private _featureProviders: Record<string, Feature<unknown>>;

  constructor() {
    this._featureProviders = Object.create(null);
  }

  fill({
    structure,
    features,
  }: {
    structure: StepStructure[];
    features: Feature<unknown>[];
  }) {
    features.forEach((cfg) => {
      const key = getName(cfg.name);
      this._featureProviders[key] = {
        service: new cfg.useService({ structure }),
      };
    });

    structure.forEach((step) => {
      toPairs(step).forEach(([fieldName, { controls }]) => {
        if (controls) {
          const getService = (fea: Feature<unknown>) => {
            const realisation = this._featureProviders[getName(fea.name)];
            if (!realisation) {
              throw new Error(
                `Did not find "${fea.name}" feature in a registry. Forgot to call "addFeatures"? `,
              );
            }
            return realisation.service;
          };

          const fieldControls = controls(getService);
          fieldControls.forEach((element) => {
            element({ initiator: { fieldName } });
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
