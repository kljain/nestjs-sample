import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './app-config/app-config.module';
import { ConfigModule } from '@nestjs/config';
import { FetchModule } from './fetch/fetch.module';
import { HtmlModule } from './html/html.module';
import { ScheduleModule } from '@nestjs/schedule';
import { S3CacheModule } from './s3-cache/s3-cache.module';
import { BrowserModule } from './browser/browser.module';
import { ScrapeModule } from './scrape/scrape.module';
import { V47Module } from './v47/v47.module';
import { SvgModule } from './svg/svg.module';
import { ThrottleModule } from './throttle/throttle.module';
import { OpenaiModule } from './openai/openai.module';
import { VoiceoverModule } from './voiceover/voiceover.module';
import { S3Module } from './s3/s3.module';
import { ElevenlabsModule } from './elevenlabs/elevenlabs.module';
import { FilesModule } from './files/files.module';
import { AeModule } from './ae/ae.module';
import { FrameioController } from './frameio/frameio.controller';
import { FrameioModule } from './frameio/frameio.module';
import { MediaModule } from './media/media.module';
import { IterateModule } from './iterate/iterate.module';
import { NexModule } from './nex/nex.module';
import { SupaModule } from './supa/supa.module';
import { RenderService } from './render/render.service';
import { RenderController } from './render/render.controller';
import { RenderModule } from './render/render.module';
import { VideoModule } from './video/video.module';
import { SqsModule } from './sqs/sqs.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FetchModule,
    HtmlModule,
    ScheduleModule.forRoot(),
    S3CacheModule,
    BrowserModule,
    ScrapeModule,
    V47Module,
    SvgModule,
    ThrottleModule,
    OpenaiModule,
    VoiceoverModule,
    S3Module,
    ElevenlabsModule,
    FilesModule,
    AeModule,
    FrameioModule,
    MediaModule,
    IterateModule,
    NexModule,
    SupaModule,
    RenderModule,
    VideoModule,
    SqsModule,
    JobModule,
  ],
  controllers: [AppController, FrameioController, RenderController],
  providers: [AppService, RenderService],
})
export class AppModule {}
