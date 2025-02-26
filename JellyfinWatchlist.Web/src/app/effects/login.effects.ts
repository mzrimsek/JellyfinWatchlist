import * as jellyfinActions from '../actions/jellyfin.actions';

import { Actions, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);

  loginActions$ = this.actions$.pipe(
    ofType(jellyfinActions.login),
    exhaustMap((action) =>
      this.jellyfinService.login(action.username, action.password).pipe(
        map((success) => {
          if (success) {
            return jellyfinActions.loginSucceeded;
          } else {
            return jellyfinActions.loginFailed;
          }
        }),
        catchError(() => of(jellyfinActions.loginFailed))
      )
    )
  );
}
