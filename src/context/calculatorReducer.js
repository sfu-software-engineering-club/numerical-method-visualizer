import Joi from 'joi';
import { ValidationError } from '../errors';
import {
    calculatorDispatchActions,
    calculatorModes,
    differentiationMethods,
    integrationMethods,
} from './constants';

/**
 * Initial State
 */
export const initialCalculatorState = {
    mode: calculatorModes.NUMERICAL_DIFFERENTIATION,
    method: differentiationMethods.MIDDLE_POINT,
};

const defaultMethod = (mode) =>
    mode === calculatorModes.NUMERICAL_DIFFERENTIATION
        ? differentiationMethods.MIDDLE_POINT
        : integrationMethods.MIDPOINT_RULE;

/**
 * Calculator Context State Schema
 */
const calculatorStateSchema = Joi.object({
    mode: Joi.string()
        .valid(
            calculatorModes.NUMERICAL_DIFFERENTIATION,
            calculatorModes.NUMERICAL_INTEGRATION,
        )
        .required(),
    method: Joi.string()
        .valid(
            differentiationMethods.MIDDLE_POINT,
            differentiationMethods.LAGRANGE_POLYNOMIAL_THREE_POINT,
            integrationMethods.MIDPOINT_RULE,
            integrationMethods.SIMPSON_RULE,
            integrationMethods.TRAPEZOIDAL_RULE,
        )
        .required(),
});

/**
 * Action Reducer
 */
function calculatorReducer(prevState, dispatch) {
    let state;
    let error;

    ({ error } = Joi.object({
        action: Joi.string()
            .required()
            .error(() => {
                throw new ValidationError(
                    `Calculator Reducer: Invalid action dispatch missing entry: action`,
                );
            }),
        value: Joi.any()
            .required()
            .error(() => {
                throw new ValidationError(
                    `Calculator Reducer: Invalid action dispatch missing entry: value`,
                );
            }),
    }).validate(dispatch));

    switch (dispatch.action) {
        case calculatorDispatchActions.UPDATE_MODE:
            state =
                dispatch.value !== prevState.mode
                    ? {
                          mode: dispatch.value,
                          method: defaultMethod(dispatch.value),
                      }
                    : { ...prevState };
            break;
        case calculatorDispatchActions.UPDATE_METHOD:
            state =
                dispatch.value !== prevState.method
                    ? { mode: prevState.mode, method: dispatch.value }
                    : { ...prevState };
            break;
        default:
            throw new ValidationError(
                `Calculator Reducer: Unhandled action type: ${dispatch.action}`,
            );
    }

    ({ error } = calculatorStateSchema.validate(state));
    if (error)
        throw new ValidationError(
            `Calculator Reducer: Invalid state update: ${error}`,
        );

    return state;
}

export default calculatorReducer;
