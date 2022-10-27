<script>
  import countries from './assets/countries.json';
  import successIcon from './assets/icons/success_icon.svg';
  import errorIcon from './assets/icons/error_icon.svg';
  import arrowDownIcon from './assets/icons/arrow_down_icon.svg';
  import { getMaskedValue, getRegexValidation, getRawValue, getPhone } from './helpers/phoneUtils';

  let initialCountry = 'Belarus';
  let isPlayerAgree = false;
  let displayBlockRules = false;
  let isPasswordSatisfied = false;

  $: currentCountryInfo = countries.find((itemCounry) => itemCounry.name === initialCountry);
  $: placeHolder = currentCountryInfo.telephoneMask;
  $: rawMaskValue = getRawValue(currentCountryInfo.telephoneMask);

  const commonFileds = {
    value: '',
    valid: false,
    message: '',
  };

  const fields = {
    tel: {
      ...commonFileds,
    },
    password: {
      ...commonFileds,
    },
  };

  $: fields.tel.value = countries.find(
    (itemCounry) => itemCounry.name === initialCountry,
  ).telephoneDialingPrefix;

  $: isDisabledSubmit = fields.tel.valid && fields.password.valid && isPlayerAgree;

  let validationPasswordRules = [
    {
      title: 'password is too long (more than 128 characters)',
      regex: '.{129,}$',
      isValid: false,
      exception: true,
    },
    {
      title: 'at least 6 symbols',
      regex: '^.{6,}$',
      isValid: false,
    },
    {
      title: 'at least 1 digit (0-9)',
      regex: '[0-9]+',
      isValid: false,
    },
    {
      title: 'at least 1 character (a-z)',
      regex: '[a-zA-Zа-яА-Я]+',
      isValid: false,
    },
  ];

  function checkRulesCompliancy(password) {
    return validationPasswordRules.map((rule) => {
      const matherRegex = new RegExp(rule.regex);
      const isValid = matherRegex.test(password);

      return {
        ...rule,
        isValid,
      };
    });
  }

  function areRulesSatisfied(ruleResults) {
    const isException = ruleResults
      .filter((rule) => rule.exception)
      .every(({ isValid }) => !isValid);

    if (!isException) return false;

    const allAreValid = ruleResults
      .filter((rule) => !rule.exception)
      .every(({ isValid }) => isValid);

    return allAreValid;
  }

  function handleInputPas(event) {
    const compliancyResult = checkRulesCompliancy(event.target.value);
    validationPasswordRules = compliancyResult;
    isPasswordSatisfied = areRulesSatisfied(compliancyResult);

    if (event.target.value.length === 0) {
      fields.password.message = '';
      fields.password.valid = false;
      return;
    }

    if (!isPasswordSatisfied) {
      displayBlockRules = true;
      fields.password.valid = false;
      fields.password.message = 'Невалидный пароль';
    } else {
      fields.password.valid = true;
      fields.password.message = 'Пароль валидный';
      displayBlockRules = false;
    }
  }

  function handleChangePas() {
    displayBlockRules = false;

    if (fields.password.value.length === 0) {
      return (fields.password.message = '');
    }

    if (!isPasswordSatisfied) {
      return (fields.password.message = 'Невалидный пароль');
    }
  }

  function checkOninputAndOnchageTel(value, input = false) {
    const rawValue = getRawValue(value);

    if (rawValue.length !== rawMaskValue.length) {
      if (input) {
        fields.tel.valid = false;
        return;
      } else {
        fields.tel.message = 'Введите корректный номер';
        return;
      }
    }

    if (currentCountryInfo?.regex) {
      const phone = getPhone(fields.tel.value);

      const operatorTelMessage = getRegexValidation(
        phone,
        'Введи корректный код мобильного оператора',
        currentCountryInfo.regex,
      );

      if (input && !!operatorTelMessage) {
        fields.tel.valid = false;
        return;
      } else if (input && !operatorTelMessage) {
        fields.tel.valid = true;
        return;
      }

      return (fields.tel.message = operatorTelMessage);
    }

    return (fields.tel.valid = true);
  }

  function handleInputTel(event) {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
    fields.tel.message = '';
    placeHolder = getMaskedValue(event.target.value, currentCountryInfo.telephoneMask, true);
    fields.tel.value = getMaskedValue(event.target.value, currentCountryInfo.telephoneMask);

    checkOninputAndOnchageTel(fields.tel.value, true);
  }
</script>

<main>
  <form>
    <div class="item-form">
      <div class="item-name"><span class="field-title">Телефон</span></div>

      <div
        class={fields.tel.message.length > 0
          ? 'tel-container error-validation-tel'
          : 'tel-container'}
      >
        <div class="flag-select-container">
          <div class="tel-icon">
            <img src={currentCountryInfo.img} alt="country-flag" width="26" height="20" />
          </div>
          <select bind:value={initialCountry}>
            {#each countries as country}
              <option value={country.name}>
                {country.name}
              </option>
            {/each}
          </select>
          <div class="tel-arrow">
            <img src={arrowDownIcon} alt="tel-arrow" />
          </div>
        </div>

        <div class="tel-input-mask">
          <input
            type="tel"
            name="tel"
            class="tel-input"
            bind:value={fields.tel.value}
            on:input={(e) => handleInputTel(e)}
            on:change={checkOninputAndOnchageTel(fields.tel.value)}
          />
          <div class="tel-mask">{placeHolder}</div>
        </div>
      </div>
      {#if fields.tel.message}
        <span class="error-tel">{fields.tel.message}</span>
      {/if}
    </div>

    <div class="item-form">
      <div class="item-name">
        <span class="field-title">Пароль</span>
      </div>
      <input
        type="password"
        name="password"
        class={fields.password.message?.length > 0 && !isPasswordSatisfied
          ? 'item-field error-validation-pas'
          : 'item-field'}
        bind:value={fields.password.value}
        on:input={(e) => handleInputPas(e)}
        on:change={handleChangePas}
        on:focus={() => (displayBlockRules = true)}
        on:blur={() => (displayBlockRules = false)}
      />

      {#if fields.password.message && !displayBlockRules}
        <span class={isPasswordSatisfied ? 'message-pas-success' : 'message-pas-error'}
          >{fields.password.message}</span
        >
      {/if}

      {#if displayBlockRules}
        <div class="block-rules">
          {#each validationPasswordRules as rule}
            {#if rule.exception && rule.isValid}
              <div class="rule-content">
                <div class="rule-icon">
                  <img src={errorIcon} alt="error-icon" />
                </div>
                <span class="rule-text error-length">{rule.title}</span>
              </div>
            {/if}
            {#if !rule.exception}
              <div class="rule-content">
                <div class="rule-icon">
                  {#if rule.isValid}
                    <img src={successIcon} alt="success-icon" />
                  {:else if !rule.isValid}
                    <div>•</div>
                  {/if}
                </div>
                <span class={rule.isValid ? 'rule-text success' : 'rule-text'}>{rule.title}</span>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <div class="item-form checkbox">
      <input type="checkbox" bind:checked={isPlayerAgree} id="agree" />
      <label class="text-agree" for="agree"
        >Мне больше 21 года, я соглашаюсь с правилами ООО "СТАТУСКВО" и Политикой обработки
        персональных данных, а также на получение рекламных и информационных рассылок.</label
      >
    </div>

    <button
      disabled={!isDisabledSubmit}
      class="submit-btn"
      on:click|preventDefault={() => {
        console.log({ fields, isPlayerAgree });
      }}
      type="submit">Зарегистрироваться</button
    >
  </form>
</main>
