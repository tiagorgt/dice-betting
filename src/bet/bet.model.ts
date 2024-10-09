import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Table
@ObjectType()
export class Bet extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  @Field(() => ID)
  id: number;

  @ForeignKey(() => User)
  @Column
  @Field()
  userId: number;

  @Column
  @Field()
  betAmount: number;

  @Column
  @Field()
  chance: number;

  @Column
  @Field()
  payout: number;

  @Column
  @Field()
  win: boolean;
}
