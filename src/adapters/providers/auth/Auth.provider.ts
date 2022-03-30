import { IAuthProvider } from "../../../application/modules/auth/providerContracts/IAuth.provider";
import userModel from "../../../infrastructure/dataBases/nodeTsKeleton/User.model";
import AppSettings from "../../../application/shared/settings/AppSettings";
import { AppConstants } from "../../../domain/shared/AppConstants";
import { ISession } from "../../../domain/session/ISession";
import { BaseProvider } from "../base/BaseProvider";
import { User } from "../../../domain/user/User";
import { sign, verify } from "jsonwebtoken";
import { TypeParser } from "../../../domain/shared/utils/TypeParser";
import { Email } from "../../../domain/user/Email";

export class AuthProvider extends BaseProvider implements IAuthProvider {
  async getJwt(session: ISession): Promise<string> {
    const token = sign(session, AppSettings.JWTEncryptionKey, {
      algorithm: AppConstants.HS512_ALGORITHM,
      expiresIn: AppSettings.JWTExpirationTime,
    });
    return Promise.resolve(token);
  }

  verifyJwt(jwt: string): ISession {
    return verify(jwt, AppSettings.JWTEncryptionKey) as ISession;
  }

  async login(email: string, encryptedPassword: string): Promise<User> {
    const founded = await userModel.getByAuthentication(email, encryptedPassword);
    if (!founded) return Promise.reject();

    (founded as User).email = new Email(TypeParser.cast<string>(founded.email));
    return Promise.resolve(founded);
  }
}
