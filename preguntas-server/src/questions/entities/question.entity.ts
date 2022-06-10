import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Category, CategorySchema } from 'src/category/entities/category.entity';
import * as mongoose from 'mongoose';

export type QuestionDocument = Question & Document;

interface Answer{
    name:string;
    isCorrect:boolean;
}

@Schema({collection:'Questions'})
export class Question {

    @Transform(({ value }) => value.toString())
    _id: string;

    @Prop()
    title:string

    @Prop()
    answers:Answer[]

    // una pregunta solo puede tener una categoria one to many
    @Prop({type: mongoose.Schema.Types.ObjectId , ref: Category.name })
    @Type(() => Category)
    category:Category;

}

export const QuestionSchema = SchemaFactory.createForClass(Question);
