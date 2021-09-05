import type { Observable } from 'rxjs';

export type BinderFactory = (config?: any) => (fieldName: string) => void;

export interface TProviderService {
  /**
   * Method for getting an Observable from Provider`s store
   */
  getRxStore?(): Observable<unknown>;
  /**
   * Method that creates binders for fields
   */
  useBinders?(): Record<string, BinderFactory>;
}

/**
 * Service might contain methods used for
 * 1 Binding field`s to some logic (it has an initiator.fieldName key)
 * 2 Other provider`s service (it might have any interface)
 * 3 Render logic that needs to watch for state changes
 */

/**
 * Binders - to bind some logic to a field/step
 * Getters - to get some real-time value
 * Renderers - to make react bindings
 */
