import { Inject, Injectable } from '@nestjs/common';
import { EDUCATIONS_REPOSITORY } from '../common/constants';
import { EducationsRepository } from './educations.providers';
import { UpdateEducationTheOrderInput } from './dto/update-education-the-order.input';
import { Transactional } from 'typeorm-transactional';
import { UpdateEducationInput } from './dto/update-education.input';
import { Education } from './education.model';

@Injectable()
export class EducationsService {
  constructor(
    @Inject(EDUCATIONS_REPOSITORY)
    private readonly educationsRepository: EducationsRepository,
  ) {}

  @Transactional()
  async updateTheOrder(userId: string, dto: UpdateEducationTheOrderInput) {
    const educations = await this.educationsRepository.getAllByUserId(userId);
    const lastOrderData = educations.find((edu) => {
      if (edu.id === dto.educationId) {
        return edu;
      }
    });

    if (!lastOrderData) {
      throw new Error('정보가 저장되어있지 않습니다.');
    }

    const lastOrder = lastOrderData.order;

    if (dto.order > educations.length - 1) {
      throw new Error('가지고 있는 정보보다 더 큰 수를 적었습니다.');
    }

    if (lastOrder < dto.order) {
      await this.educationsRepository.updateTheOrderFromBelow(userId, {
        lastOrder: lastOrderData.order,
        order: dto.order,
      });
    }

    if (lastOrder > dto.order) {
      await this.educationsRepository.updateTheOrderFromAbove(userId, {
        lastOrder: lastOrderData.order,
        order: dto.order,
      });
    }

    const result = await this.educationsRepository.updateTheOrder(
      userId,
      lastOrderData.id,
      dto.order,
    );

    return result.affected;
  }

  async update(dto: UpdateEducationInput) {
    const education = new Education();
    dto.description !== undefined && (education.description = dto.description);
    dto.major !== undefined && (education.major = dto.major);
    dto.startDt !== undefined && (education.startDt = dto.startDt);
    dto.endDt !== undefined && (education.endDt = dto.endDt);
    dto.schoolId !== undefined && (education.schoolId = dto.schoolId);
    dto.schoolName && (education.schoolName = dto.schoolName);

    const result = await this.educationsRepository.update(
      dto.educationId,
      education,
    );

    return result.affected;
  }

  async delete(educationId: string) {
    const result = await this.educationsRepository.delete(educationId);
    return result.affected;
  }

  async getAllByUserId(userId: string) {
    return await this.educationsRepository.getAllByUserId(userId);
  }
}
