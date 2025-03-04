import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { toBoolean } from 'src/utility/to-boolean';
import { toInteger } from 'lodash';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get<T = string>(path: string, defaultValue?: T): T {
    return this.configService.get<T>(path, defaultValue);
  }

  private getBoolean(path: string, defaultValue = false): boolean {
    return toBoolean(this.get<boolean>(path, defaultValue));
  }

  private getInteger(path: string, defaultValue?: number): number {
    return toInteger(this.get<number>(path, defaultValue));
  }

  public get env(): string {
    return this.get('NODE_ENV');
  }

  public get version(): string {
    return this.get('VERSION');
  }

  public get welcome(): string {
    return this.get('WELCOME');
  }

  public get port(): number {
    return this.getInteger('PORT');
  }

  public get myUrl(): string {
    return this.get('MY_URL');
  }

  public get openApiEnabled(): boolean {
    return this.getBoolean('OPENAPI_ENABLED');
  }

  public get awsAccessKeyId(): string {
    return this.get('AWS_ACCESS_KEY_ID');
  }

  public get awsSecretAccessKey(): string {
    return this.get('AWS_SECRET_ACCESS_KEY');
  }

  public get awsAccessKeySQS(): string {
    return this.get('AWS_ACCESS_KEY_SQS');
  }

  public get awsSecretAccessKeySQS(): string {
    return this.get('AWS_SECRET_SQS');
  }

  public get s3CacheBucket(): string {
    return this.get('S3_CACHE_BUCKET');
  }

  public get s3PublicCacheBucket(): string {
    return this.get('S3_PUBLIC_CACHE_BUCKET');
  }

  public get s3PublicCacheUrl(): string {
    return this.get('S3_PUBLIC_CACHE_URL');
  }

  public get s3FilesBucket(): string {
    return this.get('S3_FILES_BUCKET');
  }

  public get s3FilesDomain(): string {
    return this.get('S3_FILES_DOMAIN');
  }

  public get s3Region(): string {
    return this.get('S3_REGION');
  }

  public get sqsQueueTranscribeVideoUrl(): string {
    return this.get('SQS_QUEUE_TRANSCRIBE_VIDEO_URL');
  }

  public get openAiKey(): string {
    return this.get('OPENAI_KEY');
  }

  public get elevenLabsKey(): string {
    return this.get('ELEVENLABS_KEY');
  }

  public get renderQueueURL(): string {
    return this.get('RENDERQUEUE_URL');
  }

  public get frameioUrl(): string {
    return this.get('FRAMEIO_URL');
  }

  public get frameioKey(): string {
    return this.get('FRAMEIO_KEY');
  }

  public get frameioTeamId(): string {
    return this.get('FRAMEIO_TEAM_ID');
  }

  public get nexUrl(): string {
    return this.get('NEX_URL');
  }

  public get nexSecret(): string {
    return this.get('NEX_SECRET');
  }

  public get fetcherAuth(): string {
    return this.get('FETCHER_AUTH');
  }

  public get supabaseUrl(): string {
    return this.get('SUPABASE_URL');
  }

  public get supabaseAnonKey(): string {
    return this.get('SUPABASE_ANON_KEY');
  }

  public get supabaseServiceKey(): string {
    return this.get('SUPABASE_SERVICE_KEY');
  }

  public get nexcloudUrl(): string {
    return this.get('NEXCLOUD_URL');
  }

  public get nexcloudSecret(): string {
    return this.get('NEXCLOUD_SECRET');
  }

  public get workerSecret(): string {
    return this.get('WORKER_SECRET');
  }
}
