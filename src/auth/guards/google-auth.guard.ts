import {
  Injectable,
  ServiceUnavailableException,
  type ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
      throw new ServiceUnavailableException(
        'Google orqali kirish hali sozlanmagan.',
      );
    return super.canActivate(context);
  }
}
