import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {
    // Injecting Users service
  }
  @Get()
  public getUsers() {
    return 'You Sent a get request to users endpoint.';
  }

  @Post()
  public createUsers(@Body() req: CreateUserDto) {
    return this.UsersService.createUser(req);
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
  public getUserById(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.UsersService.findAll(getUsersParamDto, limit, page);
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
