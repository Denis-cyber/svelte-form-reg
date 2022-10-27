export const getRawValue = (value) => value.replace(/\W/g, '');

export const getMaskedValue = (value, mask, placeholder = false) => {
  if (!mask) {
    return value;
  }

  const rawValue = getRawValue(value.toString());
  const maskTemplate = mask.replace(/\d/g, 'X');
  const splitMask = maskTemplate.split('');
  const splitValue = rawValue.split('');
  const resultLength = splitMask.length;

  let maskIndex;
  let valueIndex = 0;

  for (maskIndex = 0; maskIndex < resultLength; maskIndex++) {
    if (valueIndex >= splitValue.length) {
      break;
    }

    if (splitMask[maskIndex] === 'X' && splitValue[valueIndex].match(/\d/)) {
      splitMask[maskIndex] = splitValue[valueIndex++];
    } else if (splitMask[maskIndex] === 'X') {
      splitMask.slice(0, maskIndex);
    }
  }

  return placeholder ? splitMask.join('') : splitMask.join('').substr(0, maskIndex);
};

export const getRegexValidation = (value, errorText, ruleParam) =>
  value.match(new RegExp(ruleParam)) ? '' : errorText;

export const getPhone = (value) => value.replace(/[^+\d]/g, '').replace(/[+]{2,}/g, '+');
