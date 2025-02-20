import { ILanguageKeys } from 'types/constants/languageKeys';
import { ZodIssueCode} from 'zod';


const getFormInputErrorText = (errorCode?: any): ILanguageKeys => {
  switch (errorCode as ZodIssueCode) {
    case 'invalid_string':
    case 'invalid_arguments':
    case 'invalid_date':
    case 'invalid_enum_value':
    case 'invalid_intersection_types':
    case 'invalid_literal':
    case 'invalid_type':
    case 'invalid_return_type':
    case 'invalid_union':
    case 'invalid_union_discriminator':
    case 'too_big':
      return 'fillCorrectlyWithName';
    case 'too_small':
      return 'inputIsRequiredWithName';
    default:
      return errorCode;
  }
};

export const I18Util = {
  getFormInputErrorText: getFormInputErrorText,
};
