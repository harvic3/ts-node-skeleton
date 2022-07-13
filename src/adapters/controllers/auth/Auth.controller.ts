import { IServiceContainer } from "../../shared/dic/IServiceContainer";
import container, { LoginUseCase } from "./container";

import BaseController, {
  INextFunction,
  EntryPointHandler,
  IRouterType,
  ServiceContext,
  IContext,
} from "../base/Base.controller";

export class AuthController extends BaseController {
  constructor(serviceContainer: IServiceContainer) {
    super(AuthController.name, serviceContainer, ServiceContext.SECURITY);
  }

  login: EntryPointHandler = async (ctx: IContext, next: INextFunction): Promise<void> => {
    const email = ctx.request.body?.email as string;
    const passwordB64 = ctx.request.body?.password as string;

    return this.handleResult(
      ctx,
      next,
      this.servicesContainer.get<LoginUseCase>(this.CONTEXT, LoginUseCase.name),
      ctx.locale,
      {
        email,
        passwordB64,
      },
    );
  };

  initializeRoutes(router: IRouterType): void {
    this.router = router;
    this.router.post("/v1/auth/login", this.login);
  }
}

export default new AuthController(container);
