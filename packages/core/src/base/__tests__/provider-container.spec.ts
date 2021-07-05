import { ProviderContainer } from '../provider-container';
import { providerFactory } from '@formula/test-utils';

describe('ProviderContainer', () => {
  it('simple provider registration', () => {
    const [{ constructorMock }, provider1] = providerFactory('fake-provider1');
    const providerContainer = new ProviderContainer({
      cfg: { providers: [provider1] },
    });

    expect(constructorMock).toHaveBeenCalledTimes(0);
    providerContainer.registerProviders();
    expect(constructorMock).toHaveBeenCalledTimes(1);
  });

  it('subdependency provider registration', () => {
    const [
      { constructorMock: constructorMock1 },
      coreProvider,
    ] = providerFactory('core-provider');
    const [
      { constructorMock: constructorMock2 },
      depProvider,
    ] = providerFactory('dep-provider', [coreProvider]);

    const providerContainer = new ProviderContainer({
      cfg: { providers: [depProvider, coreProvider, depProvider] },
    });

    expect(constructorMock1).toHaveBeenCalledTimes(0);
    expect(constructorMock2).toHaveBeenCalledTimes(0);
    providerContainer.registerProviders();
    // constructor for each provider called only once
    expect(constructorMock1).toHaveBeenCalledTimes(1);
    expect(constructorMock2).toHaveBeenCalledTimes(1);
    providerContainer.registerSingleProvider(depProvider);
    // once
    expect(constructorMock1).toHaveBeenCalledTimes(1);
    expect(constructorMock2).toHaveBeenCalledTimes(1);
    providerContainer.registerSingleProvider(coreProvider);
    // once
    expect(constructorMock1).toHaveBeenCalledTimes(1);
    expect(constructorMock2).toHaveBeenCalledTimes(1);
    providerContainer.registerProviders();
    // once - never called more than once
    expect(constructorMock1).toHaveBeenCalledTimes(1);
    expect(constructorMock2).toHaveBeenCalledTimes(1);
  });

  it('passing arguments to provider', () => {
    const [, coreProvider] = providerFactory('core-provider');
    const [{ constructorMock }, depProvider] = providerFactory('dep-provider', [
      coreProvider,
    ]);

    const providerContainer = new ProviderContainer({ cfg: { providers: [] } });

    providerContainer.registerSingleProvider(depProvider, { foo: 'bar' });
    providerContainer.registerSingleProvider(depProvider, { foo: 'baz' });
    expect(constructorMock).toHaveBeenCalledTimes(1);
    expect(constructorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        deps: [{}], // service given by core-provider
        globalStore: expect.any(Object),
      }),
      { foo: 'bar' },
    );
  });

  it.todo('cyclic dependency provider registration');

  // should not test getBinders and bindControls methods
  // as they should migrate to ConfigProvider in the future
  it.todo('getService');
});
