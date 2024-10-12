import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Bet } from '../bet/bet.model';

@Table
@ObjectType()
export class User extends Model {
  /**
   * The unique identifier of the user.
   */
  @Column({ primaryKey: true, autoIncrement: true })
  @Field(() => ID, { description: 'The unique identifier of the user' })
  id: number;

  /**
   * The name of the user.
   */
  @Column
  @Field({ description: 'The name of the user' })
  name: string;

  /**
   * The balance of the user.
   */
  @Column({ type: DataType.DECIMAL })
  @Field(() => Float, { description: 'The balance of the user' })
  balance: number;

  /**
   * The bets placed by the user.
   */
  @HasMany(() => Bet)
  players: Bet[];
}
