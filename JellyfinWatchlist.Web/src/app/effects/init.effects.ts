import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';

import { SystemInfoActions } from '../actions/system-info.actions';
import { map } from 'rxjs';

@Injectable()
export class InitEffects {
  private actions$ = inject(Actions);

  getSystemInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => SystemInfoActions.get())
    );
  });
}
