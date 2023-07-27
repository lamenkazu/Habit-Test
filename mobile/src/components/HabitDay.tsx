import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import clsx from 'clsx';

//Dimensions pega as dimensões da tela do dispositivo em que o app se encontra.
import { Dimensions } from 'react-native';

import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import dayjs from 'dayjs';

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5


export const DAY_MARGIN_BETWEEN = 8
//Calculo para saber quantos quadradinhos cabem na tela.
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)


interface Props extends TouchableOpacityProps {
    amountOfHabits?: number;
    amountCompleted?: number;
    date: Date;
};

export function HabitDay( {amountCompleted = 0, amountOfHabits = 0, date, ...rest}: Props){

    const amoutAccomplishedPercentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today)


    return (
        <TouchableOpacity 
            className={clsx("rounded-lg border-2 m-1", {
                ["bg-zinc-900 border-zinc-800"] : amoutAccomplishedPercentage === 0,
                ["bg-violet-900 border-violet-700"] : amoutAccomplishedPercentage > 0 && amoutAccomplishedPercentage < 20,
                ["bg-violet-800 border-violet-600"] : amoutAccomplishedPercentage >= 20 && amoutAccomplishedPercentage < 40,
                ["bg-violet-700 border-violet-500"] : amoutAccomplishedPercentage >= 40 && amoutAccomplishedPercentage < 60,
                ["bg-violet-600 border-violet-500"] : amoutAccomplishedPercentage >= 60 && amoutAccomplishedPercentage < 80,
                ["bg-violet-500 border-violet-400"] : amoutAccomplishedPercentage >= 80,
                ["border-white border-4"] : isCurrentDay
            })}
            style={{width: DAY_SIZE, height: DAY_SIZE}}
            activeOpacity={0.7}
            {...rest}
        />
    );
}