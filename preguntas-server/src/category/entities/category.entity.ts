import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';

export type QuestionDocument = Category & Document;

@Schema({collection:'Categories'})
export class Category {

    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop()
    name:string

    @Prop()
    difficulty:string

  

}

export const CategorySchema = SchemaFactory.createForClass(Category);
