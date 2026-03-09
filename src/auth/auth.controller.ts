import { Controller, Post, Body, Get,Request,UseGuards, Delete} from '@nestjs/common';
import * as auth from './dtos/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

//POST /auth/login -- > {email, password}

@Controller('auth')
export class AuthController {
    
    constructor( private authService: AuthService ) {}

    // POST /auth/signUp
     @Post("signup")
    async signup(@Body() body: auth.SignUpDto) {

        return this.authService.signUp(body)
    }

// POST /auth/signIn
    @Post("signin")
    async signin(@Body() body: auth.SignInDto) {
    return this.authService.signIn(body) 

        return body
    }

    @UseGuards(AuthGuard)
    @Get("me")
    async me(@Request() request) {
        return request.user
    }       

   @UseGuards(AuthGuard)
@Delete("delete")
async delete(@Request() request) {
  return this.authService.delete(request.user.id)
}
}
