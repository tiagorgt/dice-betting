import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bet } from './bet.model';
import { BetService } from './bet.service';
import { BetResolver } from './bet.resolver';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Bet, User])],
  providers: [BetService, BetResolver],
})
export class BetModule {}
