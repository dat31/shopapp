import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  test() {
    const idtoken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2hvcGFwcC00MDcxMDQiLCJhdWQiOiJzaG9wYXBwLTQwNzEwNCIsImF1dGhfdGltZSI6MTcyMTE5MzA1NSwidXNlcl9pZCI6IkNqNWYwRnBiNHpSSGs4eUpMMTFCcjNSUVM5bTEiLCJzdWIiOiJDajVmMEZwYjR6UkhrOHlKTDExQnIzUlFTOW0xIiwiaWF0IjoxNzIxMTkzMDU1LCJleHAiOjE3MjExOTY2NTUsInBob25lX251bWJlciI6Iis4NDg2ODEwNDAyNCIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzg0ODY4MTA0MDI0Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGhvbmUifX0.doa0GA59PO1bWYWwDCtzdx-maiiBYEpzaOIwTefnbsFl3jrJqHsTbYTEhlZRujSGd-UZeQvkQU6piJMlXDhkDY4oGR6ZSPIRuTqbZmYsq0GICePvigktMFYKBSc7eYQGm8dPUzaPmTnWzW89QfG-17gwNurp1-61QsUx3V8hZAE5vmnVG9G98YEAWJPbxE7Ds3A0S2HXH8kj-CBv10eo3zoDQ5D9v6Xxwaycxqvv8OmUtH2isap5Ebx8xmOyz88QuqGyWrMLMqqXa639uqTeV57IM2qEAHNENK1MrOaeD3FBNVSYAOFWxr5kILjpn1W4SVpPbAYlYQeYqF5_mCHSug';

    this.auth
      .createSessionCookie(idtoken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000,
      })
      .then((session) => {
        console.log(session);

        this.auth
          .verifySessionCookie(session)
          .then((user) => {
            console.log('user', user);
          })
          .catch((e) => {
            console.log('e', e);
          });
      });
  }

  get auth() {
    return admin.auth();
  }
}
