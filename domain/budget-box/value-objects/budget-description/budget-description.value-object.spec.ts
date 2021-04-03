import { ErrorMessages } from '../../../shared';
import { BudgetDescriptionValueObject } from './budget-description.value-object';

describe('description.value-object', () => {
  it('should create a valid description value object', () => {
    const description = BudgetDescriptionValueObject.create(
      'valid_description',
    );
    expect(description.isSuccess).toBe(true);
  });

  it('should normalize description to lowercase', () => {
    const description = BudgetDescriptionValueObject.create(
      'VaLiD_DesCriPtiOn',
    );
    expect(description.isSuccess).toBe(true);
    expect(description.getResult().value).toBe('valid_description');
  });

  it('should fail if not provide description', () => {
    const description = BudgetDescriptionValueObject.create(' ');
    expect(description.isFailure).toBe(true);
    expect(description.error).toBe(
      ErrorMessages.INVALID_BUDGET_DESCRIPTION_LENGHT,
    );
  });

  it('should fail if provide long description (greatter than 30 char)', () => {
    const description = BudgetDescriptionValueObject.create(
      'Invalid description lenght greatter than max 30 char',
    );
    expect(description.isFailure).toBe(true);
    expect(description.error).toBe(
      ErrorMessages.INVALID_BUDGET_DESCRIPTION_LENGHT,
    );
  });
});
