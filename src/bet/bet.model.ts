import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@Table
@ObjectType()
export class Bet extends Model {
  /**
   * The unique identifier of the bet.
   */
  @Column({ primaryKey: true, autoIncrement: true })
  @Field(() => ID, { description: 'The unique identifier of the bet' })
  id: number;

  /**
   * The ID of the user who placed the bet.
   */
  @ForeignKey(() => User)
  @Column
  @Field(() => ID, { description: 'The ID of the user who placed the bet' })
  userId: number;

  /**
   * The amount of the bet.
   */
  @Column
  @Field({ description: 'The amount of the bet' })
  betAmount: number;

  /**
   * The chance of winning the bet.
   */
  @Column({ type: DataType.FLOAT })
  @Field(() => Float, { description: 'The chance of winning the bet' })
  chance: number;

  /**
   * The payout of the bet.
   */
  @Column
  @Field({ description: 'The payout of the bet' })
  payout: number;

  /**
   * Whether the bet was won.
   */
  @Column
  @Field({ description: 'Whether the bet was won' })
  win: boolean;
}
