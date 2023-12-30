import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Sub } from './sub.model';
import { SubsService } from './subs.service';
import { CreateSubInput } from './dto/create-sub.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAccessTokenPayload } from '../auth/interfaces/jwt-access-token-payload.interface';
import { CurAccessTokenPayload } from '../auth/decorators/cur-access-token-payload.decorator';
import { DeleteSubInput } from './dto/delete-sub.input';
import { SubsWithSubscriberIdArgs } from './dto/subs-with-subscriber-id.args';
import { SubsWithPublisherIdArgs } from './dto/subs-with-publisher-id.args';
import { Loader } from '../common/decorators/loader.decorator';
import { UsersLoader } from '../users/users.loader';
import DataLoader from 'dataloader';
import { User } from '../users/user.model';
import { SubsLoader } from './subs.loader';
import { Key } from './subs.providers';

@Resolver(() => Sub)
export class SubsResolver {
  constructor(private readonly subsService: SubsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int, {
    description: `
      * 기능
        - 구독 생성
      * 인증
        - Bearer (JWT)
    `,
  })
  async createSub(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args('input') input: CreateSubInput,
  ) {
    return await this.subsService.create({
      subscriberId: payload.sub,
      publisherId: input.publisherId,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int, {
    description: `
      * 기능
        - 구독 삭제
      * 인증
        - Bearer (JWT)
    `,
  })
  async deleteSub(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args('input') input: DeleteSubInput,
  ) {
    return await this.subsService.delete({
      subscriberId: payload.sub,
      publisherId: input.publisherId,
    });
  }

  @Query(() => [Sub], {
    description: `
      * 기능
        - 구독자 ID가 특정 값인 구독 리스트 읽기
      * 인증
        - 없음
    `,
  })
  async subsWithSubscriberId(@Args() args: SubsWithSubscriberIdArgs) {
    return await this.subsService.getBySubscriberId(args.subscriberId, {
      take: args.take,
      skip: args.skip,
    });
  }

  @Query(() => [Sub], {
    description: `
      * 기능
        - 출판인 ID가 특정 값인 구독 리스트 읽기
      * 인증
        - 없음
    `,
  })
  async subsWithPublisherId(@Args() args: SubsWithPublisherIdArgs) {
    return await this.subsService.getByPublisherId(args.publisherId, {
      take: args.take,
      skip: args.skip,
    });
  }

  @ResolveField()
  async subscriber(
    @Parent() subscription: Sub,
    @Loader(UsersLoader)
    loader: DataLoader<string, User | null>,
  ) {
    return await loader.load(subscription.subscriberId);
  }

  @ResolveField()
  async publisher(
    @Parent() subscription: Sub,
    @Loader(UsersLoader)
    loader: DataLoader<string, User | null>,
  ) {
    return await loader.load(subscription.publisherId);
  }

  @ResolveField()
  async isAlsoSubscribing(
    @Parent() subscription: Sub,
    @Loader(SubsLoader)
    loader: DataLoader<Key, Sub | null>,
  ) {
    const sub = await loader.load({
      subscriberId: subscription.publisherId,
      publisherId: subscription.subscriberId,
    });

    return sub ? true : false;
  }
}
