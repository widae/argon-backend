import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';
import { SignUpInput } from './dto/sign-up.input';
import { SignUpWithGoogleInput } from './dto/sign-up-with-google.input';
import { LogInResult } from '../auth/models/log-in-result.model';
import { AuthService } from '../auth/auth.service';
import {
  Inject,
  LoggerService,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { FilesService } from '../files/files.service';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { FileValidationPipe } from '../files/pipes/file-validation.pipe';
import { BufferUpload } from '../files/interfaces/buffer-upload.interface';
import { JwtAccessTokenPayload } from '../auth/interfaces/jwt-access-token-payload.interface';
import { CurAccessTokenPayload } from '../auth/decorators/cur-access-token-payload.decorator';
import { ExposeTo } from '../common/enums/expose-to.enum';
import { UpdateMyselfInput } from './dto/update-myself.input';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly filesService: FilesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Mutation(() => LogInResult, {
    description: `
      * 인증
        - 없음
      * 기능
        - 이메일 & 비밀번호 회원 가입 (사용자 생성)
      * 반환
        - 로그인 결과 (LogInResult)
    `,
  })
  async signUp(@Args('input') input: SignUpInput) {
    const { userId } = await this.usersService.signUp(input);
    return await this.authService.generateTokens(userId);
  }

  @Mutation(() => LogInResult, {
    description: `
      * 인증
        - 없음
      * 기능
        - 구글 회원 가입 (사용자 생성)
      * 반환
        - 로그인 결과 (LogInResult)
    `,
  })
  async signUpWithGoogle(@Args('input') input: SignUpWithGoogleInput) {
    const { userId } = await this.usersService.signUpWithGoogle(input);
    return await this.authService.generateTokens(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int, {
    description: `
      * 인증
        - Bearer (JWT)
      * 기능
        - 사용자 수정
      * 반환
        - 수정된 개체 수
    `,
  })
  async updateMyself(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args('input') input: UpdateMyselfInput,
  ) {
    return await this.usersService.updateMyself(payload.sub, {
      nickname: input.nickname,
      job: input.job,
      desc: input.desc,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String, {
    description: `
      * 인증
        - Bearer (JWT)
      * 기능
        - 사용자 이미지 업로드
      * 반환
        - 이미지 URL
    `,
  })
  async uploadUserImage(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args(
      'upload',
      { type: () => GraphQLUpload },
      new FileValidationPipe({
        mimetypes: ['image/png', 'image/jpg', 'image/jpeg'],
        maxBytes: 300 * 1000, // 300 KB
      }),
    )
    upload: BufferUpload,
  ) {
    return await this.usersService.uploadUserImage(payload.sub, upload);
  }

  @SerializeOptions({
    groups: [ExposeTo.ME],
  })
  @UseGuards(GqlAuthGuard)
  @Query(() => User, {
    description: `
      * 인증
        - Bearer (JWT)
      * 기능
        - 화자에 대한 읽기
      * 반환
        - 사용자 개체
    `,
  })
  async me(@CurAccessTokenPayload() payload: JwtAccessTokenPayload) {
    return await this.usersService.getById(payload.sub);
  }

  @ResolveField()
  async imageUrl(@Parent() user: User) {
    try {
      return user.imageName === null
        ? null
        : await this.filesService.keyToUrl(user.imageName);
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
