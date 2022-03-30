import { ApplicationError } from "../../../../application/shared/errors/ApplicationError";
import resources, { resourceKeys } from "../../../../application/shared/locals/messages";
import applicationStatus from "../../../../application/shared/status/applicationStatus";
import { NextFunction, Request, Response } from "../../../app/core/Modules";
import { authProvider } from "../../../../adapters/providers/container";
import { TypeParser } from "../../../../domain/shared/utils/TypeParser";
import { TryWrapper } from "../../../../domain/shared/utils/TryWrapper";
import ArrayUtil from "../../../../domain/shared/utils/ArrayUtil";
import { ISession } from "../../../../domain/session/ISession";
import { Middleware } from "../..";

const TOKEN_PARTS = 2;
const TOKEN_POSITION_VALUE = 1;

class AuthorizationMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isWhiteList) return next();

    const auth = req.headers.authorization;

    if (!auth)
      return next(this.getUnauthorized(resources.get(resourceKeys.AUTHORIZATION_REQUIRED)));

    const jwtParts = ArrayUtil.allOrDefault((auth as string).split(/\s+/));
    if (jwtParts.length !== TOKEN_PARTS)
      return next(this.getUnauthorized(resources.get(resourceKeys.AUTHORIZATION_REQUIRED)));

    const token = ArrayUtil.getIndex(jwtParts, TOKEN_POSITION_VALUE);
    const sessionResult = TryWrapper.exec(authProvider.verifyJwt, [token]);
    if (!sessionResult.success)
      return next(this.getUnauthorized(resources.get(resourceKeys.AUTHORIZATION_REQUIRED)));

    req.session = TypeParser.cast<ISession>(sessionResult.value);

    return next();
  };

  private getUnauthorized(message: string): ApplicationError {
    return new ApplicationError(
      AuthorizationMiddleware.name,
      message,
      applicationStatus.UNAUTHORIZED,
    );
  }
}

export default new AuthorizationMiddleware();
