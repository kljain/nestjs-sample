import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { AppConfigService } from 'src/app-config/app-config.service';
import { milliseconds } from 'src/utility/milliseconds';
import { tryParseJson } from 'src/utility/try-parse-json';

export interface CachedMethodParams<T> {
  method: (...args: any[]) => Promise<T>;
  params: any[];
  cacheKey?: string;
  cacheDuration?: number;
}

@Injectable()
export class S3CacheService {
  private s3: S3;
  private bucket: string;

  constructor(private readonly appConfigService: AppConfigService) {
    this.bucket = this.appConfigService.s3CacheBucket;
    this.s3 = new S3({
      credentials: {
        accessKeyId: appConfigService.awsAccessKeyId,
        secretAccessKey: appConfigService.awsSecretAccessKey,
      },
    });
  }

  async get(key: string): Promise<any> {
    const cacheObject = await this.s3
      .getObject({ Bucket: this.bucket, Key: key })
      .catch((err) => {
        console.log(`Error getting cache for ${key}: ${err}`);
        return null;
      });
    if (!cacheObject) {
      return null;
    }
    const cacheData = tryParseJson(cacheObject.Body.toString('utf-8'), null);
    if (!cacheData) {
      console.log(`Cache for ${key} is not valid JSON`);
      return null;
    }
    const cacheTimestamp = cacheData?.timestamp;
    if (!cacheTimestamp || typeof cacheTimestamp !== 'number') {
      console.log(`Cache for ${key} is missing timestamp`);
      return null;
    }
    const currentTime = new Date().getTime();
    const cacheDuration = cacheData?.cacheDuration;
    if (cacheDuration && currentTime - cacheTimestamp > cacheDuration) {
      console.log(`Cache for ${key} has expired`);
      return null;
    }
    console.log(`Using cache for ${key}`);
    return cacheData.data;
  }

  async set(key, data, cacheDuration = milliseconds.minutes(5)): Promise<void> {
    const cacheData = this.setExpirationInfoForData(data, cacheDuration);
    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: JSON.stringify(cacheData),
      })
      .then(() => {
        console.log(`Cached ${key}`);
      })
      .catch((err) => {
        console.log(`Error caching ${key}: ${err}`);
      });
  }

  async clear(key: string): Promise<void> {
    await this.s3
      .deleteObject({ Bucket: this.bucket, Key: key })
      .catch((err) => {
        console.log(`Error clearing cache for ${key}: ${err}`);
      });
    console.log(`Cleared cache for ${key}`);
  }

  async clearAll(): Promise<void> {
    const listParams = { Bucket: this.bucket };
    const { Contents } = await this.s3.listObjects(listParams);

    if (!Contents || Contents.length === 0) {
      console.log(`No cache to clear in bucket ${this.bucket}`);
      return;
    }

    const deleteParams = {
      Bucket: this.bucket,
      Delete: {
        Objects: Contents.map((content) => ({ Key: content.Key })),
        Quiet: true,
      },
    };
    console.log('deleteParams', deleteParams);
    await this.s3.deleteObjects(deleteParams).catch((err) => {
      console.log(`Error clearing cache in bucket ${this.bucket}: ${err}`);
    });
    console.log(`Cleared all cache in bucket ${this.bucket}`);
  }

  public async cachedMethod<T>({
    method,
    params,
    cacheKey,
    cacheDuration = milliseconds.minutes(5),
  }: CachedMethodParams<T>): Promise<T> {
    if (!cacheKey) {
      cacheKey = this.generateCacheKey(method.name, params);
    }

    const cachedResult = await this.get(cacheKey);
    if (cachedResult !== null) {
      return cachedResult;
    }

    const result = await method(...params);
    await this.set(cacheKey, result, cacheDuration);
    return result;
  }

  private generateCacheKey(methodName: string, params: any[]): string {
    const serializedParams = JSON.stringify(params);
    return `${methodName}:${serializedParams}`;
  }

  private setExpirationInfoForData(data, cacheDuration) {
    return { data, timestamp: new Date().getTime(), cacheDuration };
  }
}
