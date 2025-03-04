import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';

import { AppConfigService } from '../app-config/app-config.service';
import { Readable } from 'stream';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private readonly appConfig: AppConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: appConfig.awsAccessKeyId,
        secretAccessKey: appConfig.awsSecretAccessKey,
      },

      region: appConfig.s3Region,
    });
  }

  /*
  Save uploaded file to S3 bucket
  */
  async saveFileWithMimetype(
    fileName: string,
    data: Buffer,
    bucket: string,
    mimetype: string,
  ): Promise<CompleteMultipartUploadCommandOutput> {
    const params: PutObjectCommandInput = {
      Key: fileName,
      Body: data,
      Bucket: bucket,
      ContentType: mimetype,
    };

    return new Upload({
      client: this.s3,
      params,
    }).done();
  }

  /*
  Get presigned URL for file in S3 bucket
  */
  async getPresignedUrl(
    fileName: string,
    bucket: string,
    expires = 60 * 5,
  ): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    return getSignedUrl(this.s3, new PutObjectCommand(params), {
      expiresIn: expires,
    });
  }

  /*
  Delete file from S3 bucket
  */
  async deleteFile(
    fileName: string,
    bucket: string,
  ): Promise<DeleteObjectCommandOutput> {
    const params: DeleteObjectCommandInput = {
      Key: fileName,
      Bucket: bucket,
    };

    return this.s3.deleteObject(params);
  }

  /*
  Get read stream for file in S3 bucket
  */
  async getReadStream(fileName: string, bucket: string): Promise<Readable> {
    const params: GetObjectCommandInput = {
      Key: fileName,
      Bucket: bucket,
    };

    const data = await this.s3.getObject(params);
    return data.Body as Readable;
  }

  /*
  Download file from S3 bucket to local path
  */
  async downloadFile(
    fileKey: string,
    bucket: string,
    localPath: string,
  ): Promise<string> {
    const params: GetObjectCommandInput = {
      Key: fileKey,
      Bucket: bucket,
    };

    const data = await this.s3.getObject(params);

    // get just the last part of the path (the filename)
    const fileNameParts = fileKey.split('/');
    const fileName = fileNameParts?.[fileNameParts.length - 1];
    if (!fileName) {
      throw new Error('Invalid file key');
    }

    const filePath = join(localPath, fileName);
    const fileStream = createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.write(data.Body, (err) => {
        if (err) {
          console.error('Error writing file', err);
          reject(err);
        } else {
          resolve(filePath);
        }
      });

      fileStream.end();
    });
  }
}
