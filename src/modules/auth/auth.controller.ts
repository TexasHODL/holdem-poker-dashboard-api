import {
  userAuth,
  googleAuthenSecretKey,
  getSecretKeyGoogleAuthen,
  verifyGoogleAuthenCode,
  checkEmailORUserName
} from '@/v1/controller/auth/userController';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from '@/modules/auth/dto/update-auth.dto';
import { GoogleAuthenDto } from './dto/google-authenticator';
@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // @ApiOperation({ summary: 'Login' })
  login (@Req() req, @Body() body: LoginDto) {
    return userAuth(req);
  }

  @Post('googleAuthenSecretKey')
  googleAuthenSecretKey (@Req() req, @Body() body: GoogleAuthenDto) {
    return googleAuthenSecretKey(req);
  }

  @Post('getSecretKeyGoogleAuthen')
  getSecretKeyGoogleAuthen (@Req() req, @Body() body: GoogleAuthenDto) {
    return getSecretKeyGoogleAuthen(req);
  }

  @Post('verifyGoogleAuthenCode')
  verifyGoogleAuthenCode (@Req() req, @Body() body: GoogleAuthenDto) {
    return verifyGoogleAuthenCode(req);
  }

  @Post("checkVerifyAuthCode")
  checkVerifyAuthCode (@Body() dto: any) {
    return checkEmailORUserName(dto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
