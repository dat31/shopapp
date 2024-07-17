import { FirebaseAuthStrategy } from './firebase-auth-strategy';

describe('FirebaseAuthStrategy', () => {
  it('should be defined', () => {
    expect(new FirebaseAuthStrategy()).toBeDefined();
  });
});
