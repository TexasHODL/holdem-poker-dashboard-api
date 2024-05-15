import { Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  private _currentUserId: string;
  private _currentUser: any;
  private _currentUserName: string;

  getCurrentUserId() {
    return this._currentUserId;
  }

  setCurrentUserId(id) {
    this._currentUserId = id;
  }

  setCurrentUserName(name) {
    this._currentUserName = name;
  }

  getCurrentUserName() {
    return this._currentUserName;
  }

  async getCurrentUser() {
    if (!this._currentUser) {
      // todo:
      // this._currentUser = await loadUser();
    }
    return this._currentUser;
  }
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
