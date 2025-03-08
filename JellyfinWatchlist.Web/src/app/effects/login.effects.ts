import * as jellyfinActions from '../actions/jellyfin.actions';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { JellyfinService } from '../services/jellyfin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);
  private router = inject(Router);
  private matSnackBar = inject(MatSnackBar);

  loginActions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(jellyfinActions.login),
      exhaustMap((action) =>
        this.jellyfinService.login(action.username, action.password).pipe(
          map((success) => {
            if (success) {
              return jellyfinActions.loginSucceeded();
            } else {
              return jellyfinActions.loginFailed();
            }
          }),
          catchError(() => of(jellyfinActions.loginFailed()))
        )
      )
    );
  });

  loginSucceededActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(jellyfinActions.loginSucceeded),
        map(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  loginFailedActions$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(jellyfinActions.loginFailed),
        map(() => {
          this.matSnackBar.open('Login failed', 'Dismiss', {
            duration: 3000,
          });
        })
      );
    },
    { dispatch: false }
  );
}
