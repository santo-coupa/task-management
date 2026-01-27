export interface Example {
    id: string;
}

export enum ExampleEnum {
    FIRST = 'first',
    SECOND = 'second',
}

/**
 * Represents logged-in user data
 * (extend this later with roles, permissions, etc.)
 */
export interface AuthUser {
    id: string;
    email: string;
    token: string;
  }
  