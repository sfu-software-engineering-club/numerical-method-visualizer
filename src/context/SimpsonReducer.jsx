import Joi from 'joi';
import { ValidationError } from '../errors';
import { graphDispatchActions } from './constants';

export const initialSimpsonState = {
    fn: '',
    upperLimit: 1,
    lowerLimit: 0,
    interval: 1,
};

const simpsonStateSchema = Joi.object({
    lowerLimit: Joi.number().required(),
    upperLimit: Joi.number().required(),
    interval: Joi.number().integer().positive().required(),
    fn: Joi.string().allow('').required(),
});
/* eslint-disable default-param-last */
function simpsonReducer(state = initialSimpsonState, action) {
    /* eslint-enable default-param-last */
    let newState;

    switch (action.type) {
        case graphDispatchActions.UPDATE_FN:
            newState = { ...state, fn: action.payload };
            break;
        case graphDispatchActions.UPDATE_LOWER_LIMIT:
            newState = { ...state, lowerLimit: action.value };
            break;
        case graphDispatchActions.UPDATE_UPPER_LIMIT:
            newState = { ...state, upperLimit: action.value };
            break;
        case graphDispatchActions.UPDATE_NUMBER_OF_INTERVAL:
            newState = { ...state, interval: action.value };
            break;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }

    const { error } = simpsonStateSchema.validate(newState);
    if (error) {
        throw new ValidationError(`Invalid state update: ${error}`);
    }

    return newState;
}

export default simpsonReducer;
