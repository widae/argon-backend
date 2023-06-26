import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { EnvVars } from '../env.validation';

@Injectable()
export class EmailsService {
  private readonly client: SESv2Client;
  private readonly from: string;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    this.client = new SESv2Client({});
    this.from = this.configService.get('EMAIL_SENDER_ADDR', {
      infer: true,
    });
  }

  async sendUsingTemplate(
    to: string[],
    templateId: string,
    templateData?: string,
  ) {
    const command = new SendEmailCommand({
      FromEmailAddress: this.from,
      Destination: { ToAddresses: to },
      Content: {
        Template: {
          TemplateName: templateId,
          TemplateData: templateData,
        },
      },
    });

    await this.client.send(command);
  }
}
