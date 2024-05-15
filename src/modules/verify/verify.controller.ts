import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    Res,
    Query 
} from '@nestjs/common';
import { VerifyService } from './verify.service';
  
@Controller('')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {}

    @Post('resendEmailVerificationLink')
    resendEmailVerificationLink (@Body() dto: any) {
        return this.verifyService.resendEmailVerificationLink(dto);
    }

    @Post('resendVerificationLinkDasboard')
    resendVerificationLinkDasboard (@Body() dto: any) {
        return this.verifyService.resendVerificationLinkDasboard(dto);
    }
        
    @Get('verifyEmail')
    verifyEmail (@Query('token') token: string, @Res() res) {
        return this.verifyService.verifyEmail({ token }, res);
    }

    @Post('websiteSendMail')
    websiteSendMail (@Body() dto: any) {
        return this.verifyService.websiteSendMail(dto);
    }

    @Post('resetPasswordPlayer')
    resetPasswordPlayer (@Body() dto: any) {
        return this.verifyService.resetPasswordPlayer(dto);
    }

    @Post("forgotPasswordUser")
    forgotPasswordUser (@Body() dto: any) {
        return this.verifyService.forgotPasswordUser(dto);
    }

    @Post("checkTokenResetExpried")
    checkTokenResetExpried (@Body() dto: any) {
        return this.verifyService.checkTokenResetExpried(dto);
    }

    @Post("resetPassword")
    resetPassword (@Body() dto: any) {
        return this.verifyService.resetPassword(dto);
    }
    

    // @Post('emailVerify')
    // emailVerify (@Body() dto: any) {
    //     return this.verifyService.emailVerify(dto);
    // }
}
  