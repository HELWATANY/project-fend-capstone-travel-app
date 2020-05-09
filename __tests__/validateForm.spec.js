import { validateForm } from '../src/client/js/validateForm';

describe("Form Validation Function", () => {
  test("it should return not valid and a massage that the statement is required", () => {
    const input = '';
    let errorMsg = 'Please check the following errors';
    const msg = 'Statement is required';
    errorMsg += `\n  - ${msg}`;

    const output = {
      valid: false,
      errorMsg
    };

    expect(validateForm(input)).toEqual(output);
  });
});

describe("Form Validation Function", () => {
  test("it should return not valid and a message that the statement should be at least than 20 characters", () => {
    const input = 'test';
    let errorMsg = 'Please check the following errors';
    const msg = 'Statement must be more at least 20 characters.';
    errorMsg += `\n  - ${msg}`;

    const output = {
      valid: false,
      errorMsg
    };

    expect(validateForm(input)).toEqual(output);
  });
});

describe("Form Validation Function", () => {
  test("it should return not valid and a message that the statement should be 280 characters or less", () => {
    const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacus orci, efficitur sit amet erat vitae, volutpat commodo odio. Nulla facilisi. Nulla cursus leo ligula, vulputate consectetur turpis pretium nec. Integer ullamcorper diam ipsum, ac cursus enim malesuada sed. Nam nulla tortor.';
    let errorMsg = 'Please check the following errors';
    const msg = 'Statement must be 280 characters or less.';
    errorMsg += `\n  - ${msg}`;

    const output = {
      valid: false,
      errorMsg
    };

    expect(validateForm(input)).toEqual(output);
  });
});

describe("Form Validation Function", () => {
  test("it should return valid without any error message", () => {
    const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lacus orci, efficitur sit amet erat vitae, volutpat commodo odio. Nulla facilisi. Nulla cursus leo ligula, vulputate consectetur turpis pretium nec. Integer ullamcorper diam ipsum, ac cursus enim malesuada sed.';
    let errorMsg = null;

    const output = {
      valid: true,
      errorMsg
    };

    expect(validateForm(input)).toEqual(output);
  });
});
