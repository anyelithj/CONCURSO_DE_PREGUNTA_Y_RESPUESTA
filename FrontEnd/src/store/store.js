import create from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export const useStore = create((set) => ({
    questions: [],
    categories:[],
    currentQuestion:{},
    money:0,
    isCorrectAnswer:false,

    customSetState({key,value}){
        console.log('key >>',key);
        console.log('value >>',value);
        set({[key]:value})
    },

    setQuestions (questions){
        set({questions})
    },

    setMoney(money){
        set({money})
    },

    setCurrentQuestion(currentQuestion){
        set({currentQuestion})
    },

    setCategories(categories){
        set({categories})
    }
}));


if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Store', useStore);
  }