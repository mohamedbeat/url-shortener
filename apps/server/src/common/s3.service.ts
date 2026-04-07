import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { EnvService } from "../config/env/env.service";





@Injectable()
export class S3Service {

  // private s3 = new S3Client({
  //   region: "us-east-1",
  //   endpoint: "http://localhost:4566",
  //   forcePathStyle: true,
  //   credentials: {
  //     accessKeyId: "test",
  //     secretAccessKey: "test",
  //   },
  // });

  private s3: S3Client = new S3Client({
    endpoint: process.env.AWS_ENDPOINT,       // http://localhost:9000
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,  // required for self-hosted S3-compatible stores
  });


  async FetchFavicon(domain: string, size: number = 16) {
    try {

      const res = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`, {
        method: "GET"
      });

      if (!res.ok) {
        return undefined
      }

      const iconBlob = await res.blob()

      // Convert blob to buffer
      const arrayBuffer = await iconBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return {
        buffer,
        size: iconBlob.size
      }

    } catch (error) {
      console.error('Invalid URL:', error);
      return undefined;
    }
  }

  async uploadIcon(filename: string, buffer: Buffer<ArrayBuffer>, size: number) {

    try {
      // Prepare upload command
      const uploadCommand = new PutObjectCommand({
        Bucket: "url-shortener",
        Key: `favicons/${filename}.png`,
        Body: buffer,
        ContentType: 'image/png',
        CacheControl: 'max-age=31536000', // Cache for 1 year
        Metadata: {
          'size': size.toString(),
          'uploaded-at': new Date().toISOString()
        }
      });

      // Upload to S3
      const result = await this.s3.send(uploadCommand);
      const publicURL = `http://localhost:4566/url-shortener/favicons/${filename}.png`;
      return publicURL

    } catch (error) {
      console.log("FAILED TO UPLOAD ICON")
      console.log(error)
      return undefined
    }

  }



  async getIconPublicURL(filename: string) {
    try {
      const command = new HeadObjectCommand({
        Bucket: 'url-shortener',
        Key: `favicons/${filename}.png`,
      })
      await this.s3.send(
        command
      );

      const publicURL = `http://localhost:4566/url-shortener/favicons/${filename}.png`;
      return publicURL;
    } catch (err: any) {
      if (err.$metadata?.httpStatusCode === 404) {
        return undefined;
      }

      return undefined;
    }
  }

}
