import { forgotpassword } from '@/v1/controller/auth/ForgotPasswordController';
import { Req, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('forgotpassword')
export class ForgotPasswordController {
  @Post()
  @ApiOperation({ summary: 'Forgot password' })
  forgotpassword(@Req() req) {
    return forgotpassword(req);
  }
}
