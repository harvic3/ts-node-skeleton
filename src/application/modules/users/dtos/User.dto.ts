import { Gender } from "../../../../domain/user/genre/Gender.enum";
import { CredentialsDto } from "../../auth/dtos/Credentials.dto";
import { BaseDto, IResult } from "../../../shared/dto/BaseDto";
import { User } from "../../../../domain/user/User";

export type IUserDto = {
  maskedUid?: string;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  passwordB64?: string;
  gender: Gender | undefined;
};

export class UserDto extends BaseDto {
  uid: string | undefined;
  maskedUid: string | undefined;
  email: string | undefined;
  password: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  gender: Gender | undefined;
  phone: string | undefined;
  birthDate: string | undefined;

  static fromJSON(json: IUserDto): UserDto {
    const userDto = new UserDto();
    userDto.email = json?.email?.toLowerCase();
    userDto.password = json.passwordB64;
    userDto.firstName = json.firstName;
    userDto.lastName = json.lastName;
    userDto.gender = json.gender;

    return userDto;
  }

  static fromMaskedUid(maskedUid: string): UserDto {
    const userDto = new UserDto();
    userDto.maskedUid = maskedUid;

    return userDto;
  }

  static fromDomain(user: User): UserDto {
    const userDto = new UserDto();
    userDto.maskedUid = user.maskedUid;
    userDto.email = user.email?.value as string;
    userDto.firstName = user.firstName;
    userDto.lastName = user.lastName;

    return userDto;
  }

  isValid(result: IResult): boolean {
    const validations: Record<string, unknown> = {};
    validations[this.appWords.get(this.appWords.keys.FIRST_NAME)] = this.firstName;
    validations[this.appWords.get(this.appWords.keys.LAST_NAME)] = this.lastName;
    validations[this.appWords.get(this.appWords.keys.EMAIL)] = this.email;
    validations[this.appWords.get(this.appWords.keys.PASSWORD)] = this.password;
    validations[this.appWords.get(this.appWords.keys.GENDER)] = this.gender;

    return this.validator.isValidEntry(result, validations);
  }

  isValidToGet(result: IResult): boolean {
    const validations: Record<string, unknown> = {};
    validations[this.appWords.get(this.appWords.keys.UID)] = this.maskedUid;

    return this.validator.isValidEntry(result, validations);
  }

  toDomain(uid: string | undefined, maskedUid: string, createdAt: string, verified: boolean): User {
    const user = new User({
      uid,
      maskedUid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      gender: this.gender,
      createdAt: createdAt,
      verified: verified,
    });
    user.password = this.password;

    return user;
  }

  toDto(): IUserDto {
    return {
      maskedUid: this.maskedUid,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
    };
  }

  getCredentialsDto(): CredentialsDto {
    return CredentialsDto.fromJSON({ email: this.email, passwordB64: this.password });
  }
}
