import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { AuthActions } from '../actions/auth.actions';
import { CurrentUserActions } from '../actions/current-user.actions';
import { JellyfinService } from '../services/jellyfin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SearchActions } from '../actions/search.actions';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private jellyfinService = inject(JellyfinService);
  private router = inject(Router);
  private matSnackBar = inject(MatSnackBar);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((action) =>
        this.jellyfinService.login(action.username, action.password).pipe(
          map((accessToken) => {
            if (accessToken) {
              return AuthActions.loginSucceeded({ accessToken });
            } else {
              return AuthActions.loginFailed();
            }
          }),
          catchError(() => of(AuthActions.loginFailed())),
        ),
      ),
    );
  });

  loginSucceededNavigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSucceeded),
        map(() => {
          this.router.navigate(['/']);
        }),
      );
    },
    { dispatch: false },
  );

  loginSucceededGetCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSucceeded),
      map(() => CurrentUserActions.get()),
    );
  });

  loginFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginFailed),
        map(() => {
          this.matSnackBar.open('Login failed', 'Dismiss', {
            duration: 3000,
          });
        }),
      );
    },
    { dispatch: false },
  );

  logoutNavigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() =>
          this.jellyfinService.logout().pipe(
            map(() => {
              this.router.navigate(['/login']);
            }),
          ),
        ),
      );
    },
    { dispatch: false },
  );

  logoutClearSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => SearchActions.clear()),
    );
  });

  logoutClearCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => CurrentUserActions.clear()),
    );
  });
}
