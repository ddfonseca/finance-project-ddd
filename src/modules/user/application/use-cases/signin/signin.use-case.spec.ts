import { SigninUseCase } from './signin.use-case';
import { JwtService } from '@nestjs/jwt';
import { DomainId, EmailValueObject } from 'types-ddd';
import { IUserRepository } from '@modules/user/domain/interfaces/user.repository.interface';
import { UserAggregate } from '@modules/user/domain';
import { PasswordValueObject } from '@modules/user/domain/password.value-object';

describe('signin.use-case', () => {

	let userRepo: IUserRepository;
	let user: UserAggregate;
	let fakeJwt: JwtService;
	let useCase: SigninUseCase;

	beforeAll(() => {

		fakeJwt = {
			sign: jest.fn()
		} as unknown as JwtService;


		user = UserAggregate.create({
			ID: DomainId.create(),
			email: EmailValueObject.create('valid_email@domain.com').getResult(),
			password: PasswordValueObject.create('valid_password').getResult(),
			terms: []
		}).getResult();

	});

	beforeEach(() => {

		userRepo = {
			delete: jest.fn(),
			exists: jest.fn(),
			find: jest.fn(),
			findOne: jest.fn(),
			save: jest.fn(),
		};

		useCase = new SigninUseCase(userRepo, fakeJwt);

	});

	it('signin.use-case should be defined', () => {
		expect(useCase).toBeDefined();
	});

	it('should return fail if not provide a valid email', async () => {
		const result = await useCase.execute({
			email: 'invalid_email',
			password: 'valid_password'
		});
		expect(result.isFailure).toBe(true);
	});

	it('should return fail if not provide a valid password', async () => {
		const result = await useCase.execute({
			email: 'valid_email@domain.com',
			password: ''
		});
		expect(result.isFailure).toBe(true);
	});

	it('should return fail if not exists user for provided email', async () => {
		jest.spyOn(userRepo, 'exists').mockResolvedValueOnce(false);

		const result = await useCase.execute({
			email: 'not_exists@domain.com',
			password: 'valid_password'
		});
		expect(result.isFailure).toBe(true);
	});

	it('should return fail if provided password does not match', async () => {
		jest.spyOn(userRepo, 'exists').mockResolvedValueOnce(true);
		jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);

		const result = await useCase.execute({ email: 'valid_email@domain.com', password: 'invalid_password' });
		expect(result.isFailure).toBe(true);
	});

	it('should return token payload if provide a valid password', async () => {
		jest.spyOn(userRepo, 'exists').mockResolvedValueOnce(true);
		jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user);
		jest.spyOn(fakeJwt, 'sign').mockReturnValueOnce('valid_token');

		const result = await useCase.execute({ email: 'valid_email@domain.com', password: 'valid_password' });
		expect(result.isSuccess).toBe(true);
		expect(result.getResult()).toEqual({ token: "valid_token" });
	});

});
