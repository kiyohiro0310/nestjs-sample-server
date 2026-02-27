import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Patch,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDTO } from './dtos/create-many.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {
    // Injecting Users service
  }
  @Get()
  public getUsers() {
    this.usersService.findAll();
    return 'You Sent a get request to users endpoint.';
  }

  @Post()
  @SetMetadata('authType', 'none')
  public createUsers(@Body() req: CreateUserDto) {
    return this.usersService.createUser(req);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create-many')
  public createManyUsers(@Body() req: CreateManyUsersDTO) {
    return this.usersService.createMany(req);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetches succefully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  public getUserById(@Param() getUsersParamDto: GetUsersParamDto) {
    return this.usersService.findOneById(getUsersParamDto.id!);
  }

  @Get('/:id/:optional')
  public getUserByIdWithOptional(
    @Param('id') id: string,
    @Query('limit') limit: any,
  ) {
    console.log(typeof id);
    console.log(typeof limit);
    return 'You sent a post request with params and query.';
  }

  @Patch()
  public patchUser(@Body() body: PatchUserDto) {
    return body;
  }
}
