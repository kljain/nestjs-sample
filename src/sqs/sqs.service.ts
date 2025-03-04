import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(private readonly appConfig: AppConfigService) {
    // Initialize the SQS client with configuration from AppConfigService
    this.sqsClient = new SQSClient({
      region: appConfig.s3Region,
      credentials: {
        accessKeyId: appConfig.awsAccessKeySQS,
        secretAccessKey: appConfig.awsSecretAccessKeySQS,
      },
    });
  }

  async addJobToQueue(queueUrl: string, jobData: any): Promise<void> {
    try {
      const messageBody = JSON.stringify(jobData);

      // Define the message parameters
      const commandParams: any = {
        QueueUrl: queueUrl,
        MessageBody: messageBody,
      };

      // Add default MessageGroupId if the queue is FIFO
      if (queueUrl.endsWith('.fifo')) {
        commandParams.MessageGroupId = 'default';
      }

      // Create and send the command
      const command = new SendMessageCommand(commandParams);
      const response = await this.sqsClient.send(command);
      console.log(`Job added to SQS queue (${queueUrl}):`, response.MessageId);
    } catch (error) {
      console.error(`Failed to add job to SQS queue (${queueUrl}):`, error);
      throw error;
    }
  }
}
