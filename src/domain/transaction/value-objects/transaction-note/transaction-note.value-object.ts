import { ErrorMessages, Result, ValueObject } from '@shared/index';

export const TRANSACTION_NOTE_MAX_LENGHT = 144;
export interface TransactionNoteValueObjectProps {
  value: string;
}

export class TransactionNoteValueObject extends ValueObject<TransactionNoteValueObjectProps> {
  private constructor(props: TransactionNoteValueObjectProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(note: string): Result<TransactionNoteValueObject> {
    const isValidLenght = note.length <= TRANSACTION_NOTE_MAX_LENGHT;
    if (!isValidLenght) {
      return Result.fail<TransactionNoteValueObject>(
        ErrorMessages.INVALID_TRANSACTION_NOTE_LENGHT,
      );
    }

    return Result.ok<TransactionNoteValueObject>(
      new TransactionNoteValueObject({ value: note }),
    );
  }
}
