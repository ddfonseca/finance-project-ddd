import { TransactionMock } from './mock/transaction.mock';

describe('transaction.aggregate', () => {

	const transactionMock = new TransactionMock();

	it('should create a valid transaction', () => {
		
		const transaction = transactionMock.domain();

		expect(transaction.isSuccess).toBe(true);
		expect(transaction.getResult().note).toBeNull();
		expect(transaction.getResult().attachment).toBeNull();
	});

	it('should create a valid transaction with updated total', () => {
		
		const transaction = transactionMock.domain(
			{
				id: 'valid_id',
				transactionCalculations: [
					{
						budgetBoxName: 'valid_name',
						budgetBoxId: 'valid_id',
						currency: {
							currency: 'BRL',
							value: 170
						}
					},
					{
						budgetBoxName: 'valid_name',
						budgetBoxId: 'valid_id',
						currency: {
							currency: 'BRL',
							value: 30
						}
					}
				]
			}
		);
			
		expect(transaction.isSuccess).toBe(true);
		expect(transaction.getResult().totalValue).toBe(200);
	});

	it('should create a valid transaction with provided id ', () => {

		const transaction = transactionMock.domain({
			id: 'valid_id',
			attachment: 'https://aws.s3.com/bucket-askjdas656/file.pdf',
			note: 'valid_description'
		});

		expect(transaction.getResult().toObject()).toMatchSnapshot();
		expect(transaction.isSuccess).toBe(true);
		expect(transaction.getResult().id.toValue()).toBe('valid_id');
		expect(transaction.getResult().note?.value).toBe('valid_description');
		expect(transaction.getResult().attachment?.value).toBe('https://aws.s3.com/bucket-askjdas656/file.pdf');
	});
});
