import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Education } from './education.model';
import { EducationsService } from './educations.service';
import { UpdateEducationTheOrderInput } from './dto/update-education-the-order.input';
import { UpdateEducationInput } from './dto/update-education.input';
import { DeleteEducationInput } from './dto/delete-education.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurAccessTokenPayload } from '../auth/decorators/cur-access-token-payload.decorator';
import { JwtAccessTokenPayload } from '../auth/interfaces/jwt-access-token-payload.interface';

@Resolver(() => Education)
export class EducationsResolver {
  constructor(private readonly educationsService: EducationsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int)
  async updateTheOrder(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args('input') input: UpdateEducationTheOrderInput,
  ) {
    return await this.educationsService.updateTheOrder(payload.sub, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int)
  async updateEducation(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args('input') input: UpdateEducationInput,
  ) {
    return await this.educationsService.update(payload.sub, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int)
  async deleteEducation(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
    @Args('input') input: DeleteEducationInput,
  ) {
    return await this.educationsService.delete(payload.sub, input.educationId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Education])
  async getAllByUserId(
    @CurAccessTokenPayload() payload: JwtAccessTokenPayload,
  ) {
    return await this.educationsService.getAllByUserId(payload.sub);
  }
}
