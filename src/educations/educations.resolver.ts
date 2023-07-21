import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Education } from './education.model';
import { EducationsService } from './educations.service';
import { UpdateEducationTheOrderInput } from './dto/update-education-the-order.input';
import { UpdateEducationInput } from './dto/update-education.input';
import { DeleteEducationInput } from './dto/delete-education.input';

@Resolver(() => Education)
export class EducationsResolver {
  constructor(private readonly educationsService: EducationsService) {}

  @Mutation(() => Int)
  async updateTheOrder(@Args('input') input: UpdateEducationTheOrderInput) {
    return await this.educationsService.updateTheOrder('userId', input);
  }

  @Mutation(() => Int)
  async updateEducation(@Args('input') input: UpdateEducationInput) {
    return await this.educationsService.update(input);
  }

  @Mutation(() => Int)
  async deleteEducation(@Args('input') input: DeleteEducationInput) {
    return await this.educationsService.delete(input.educationId);
  }

  @Query(() => [Education])
  async getAllByUserId() {
    return await this.educationsService.getAllByUserId('userId');
  }
}
