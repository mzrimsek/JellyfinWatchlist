import * as authActions from '../actions/auth.actions';
import * as currentUserActions from '../actions/current-user.actions';
import * as searchActions from '../actions/search.actions';

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

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap((action) =>
        this.jellyfinService.login(action.username, action.password).pipe(
          map((success) => {
            if (success) {
              return authActions.loginSucceeded();
            } else {
              return authActions.loginFailed();
            }
          }),
          catchError(() => of(authActions.loginFailed()))
        )
      )
    );
  });

  loginSucceededNavigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSucceeded),
        map(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  loginSucceededGetCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      map(() => currentUserActions.getCurrentUser())
    );
  });

  loginFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginFailed),
        map(() => {
          this.matSnackBar.open('Login failed', 'Dismiss', {
            duration: 3000,
          });
        })
      );
    },
    { dispatch: false }
  );

  logoutNavigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logout),
        exhaustMap(() =>
          this.jellyfinService.logout().pipe(
            map(() => {
              this.router.navigate(['/login']);
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  logoutClearSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.logout),
      map(() => searchActions.clearSearch())
    );
  });

  logoutClearCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.logout),
      map(() => currentUserActions.clearCurrentUser())
    );
  });
}
