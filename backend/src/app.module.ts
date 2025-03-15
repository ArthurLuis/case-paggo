import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { LlmResponseModule } from './llm-response/llm-response.module';

@Module({
  imports: [AuthModule, DatabaseModule, UserModule, DocumentModule, LlmResponseModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
