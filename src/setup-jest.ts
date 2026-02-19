import 'jest-preset-angular/setup-jest';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  mixin: jest.fn(() => ({
    fire: jest.fn()
  }))
}));
